import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat.service';

export interface ChatMessage {
  id: string;
  opportunityId: number;
  stepIndex: number;
  stepName: string;
  senderRole: 'admin' | 'auditor';
  senderName: string;
  senderId: string;
  message: string;
  timestamp: Date;
  messageType: 'question' | 'response' | 'info' | 'requirement';
  isRead: boolean;
  attachments?: string[];
}

@Component({
  selector: 'app-pipeline-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container" [class.minimized]="isMinimized">
      <!-- En-tête du Chat -->
      <div class="chat-header" (click)="toggleChat()">
        <div class="header-content">
          <div class="chat-title">
            <i class="fas fa-comments"></i>
            <span>Chat Pipeline</span>
            <div class="unread-badge" *ngIf="totalUnreadCount > 0">
              {{ totalUnreadCount }}
            </div>
          </div>
          <div class="online-status" *ngIf="otherUserOnline">
            <div class="status-dot"></div>
            <span>{{ otherUserName }} en ligne</span>
          </div>
        </div>
        <button class="toggle-btn" (click)="toggleChat(); $event.stopPropagation()">
          <i class="fas" [class.fa-chevron-down]="!isMinimized" [class.fa-chevron-up]="isMinimized"></i>
        </button>
      </div>

      <!-- Contenu du Chat -->
      <div class="chat-body" *ngIf="!isMinimized">
        
        <!-- Navigation des Étapes -->
        <div class="steps-nav">
          <div class="steps-container">
            <button 
              *ngFor="let stepName of stepNames; let i = index"
              class="step-btn"
              [class.active]="currentStep === i"
              [class.has-unread]="getStepUnreadCount(i) > 0"
              (click)="switchToStep(i)">
              <span class="step-number">{{ i + 1 }}</span>
              <span class="step-name">{{ stepName }}</span>
              <div class="unread-indicator" *ngIf="getStepUnreadCount(i) > 0">
                {{ getStepUnreadCount(i) }}
              </div>
            </button>
          </div>
        </div>

        <!-- Zone des Messages -->
        <div class="messages-container">
          <div class="messages-header">
            <h3>{{ stepNames[currentStep] }}</h3>
            <div class="participants">
              <span class="participant admin">
                <i class="fas fa-user-shield"></i> Admin
              </span>
              <span class="participant auditor">
                <i class="fas fa-user-check"></i> Auditeur
              </span>
            </div>
          </div>

          <div class="messages-list" #messagesContainer>
            <div *ngIf="currentStepMessages.length === 0" class="empty-messages">
              <i class="fas fa-comments"></i>
              <p>Aucun message pour cette étape</p>
              <small>Commencez la conversation...</small>
            </div>

            <div 
              *ngFor="let message of currentStepMessages"
              class="message"
              [class.own]="message.senderId === currentUserId"
              [class.other]="message.senderId !== currentUserId"
              [class.admin]="message.senderRole === 'admin'"
              [class.auditor]="message.senderRole === 'auditor'">
              
              <div class="message-info">
                <span class="sender">
                  <i class="fas fa-user-shield" *ngIf="message.senderRole === 'admin'"></i>
                  <i class="fas fa-user-check" *ngIf="message.senderRole === 'auditor'"></i>
                  {{ message.senderName }}
                </span>
                <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
              </div>
              
              <div class="message-text">
                {{ message.message }}
              </div>
            </div>
          </div>

          <!-- Indicateur de frappe -->
          <div class="typing-indicator" *ngIf="isOtherUserTyping">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>{{ otherUserName }} écrit...</span>
          </div>
        </div>

        <!-- Zone de Saisie -->
        <div class="input-container">
          <div class="message-input">
            <input 
              type="text"
              [(ngModel)]="newMessage"
              placeholder="Tapez votre message..."
              (keypress)="onKeyPress($event)"
              (input)="onTyping()"
              [disabled]="isSending"
              class="input-field">
            
            <button 
              class="send-btn"
              (click)="sendMessage()"
              [disabled]="!newMessage.trim() || isSending">
              <i class="fas fa-paper-plane" *ngIf="!isSending"></i>
              <i class="fas fa-spinner fa-spin" *ngIf="isSending"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./pipeline-chat.component.css']
})
export class PipelineChatComponent implements OnInit, OnDestroy {
  @Input() opportunityId!: number;
  @Input() currentStep: number = 0;
  @Input() currentUserRole: string = '';

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  stepNames = [
    'Opportunity Review',
    'Potential Application',
    'Proposal',
    'Negotiation',
    'Contract'
  ];

  // Variables
  currentStepMessages: ChatMessage[] = [];
  newMessage = '';
  isMinimized = false;
  isSending = false;
  isOtherUserTyping = false;
  otherUserName = '';
  otherUserOnline = false;
  currentUserId = '';
  totalUnreadCount = 0;

  private subscriptions: Subscription[] = [];
  private typingTimeout: any;

  constructor(private chatService: ChatService) {
    this.currentUserId = this.getCurrentUserId();
    this.otherUserName = this.isAdmin ? 'Auditeur' : 'Admin';
  }

  ngOnInit(): void {
    // Initialiser le chat
    this.chatService.initializeChat(this.opportunityId, this.currentUserId);

    // S'abonner aux messages
    const messagesSubscription = this.chatService.messages$.subscribe(messages => {
      this.updateCurrentStepMessages();
      this.updateUnreadCount();
      setTimeout(() => this.scrollToBottom(), 100);
    });
    this.subscriptions.push(messagesSubscription);

    // S'abonner au statut de frappe
    const typingSubscription = this.chatService.typing$.subscribe(typing => {
      this.isOtherUserTyping = typing.isTyping && typing.userId !== this.currentUserId;
    });
    this.subscriptions.push(typingSubscription);

    // S'abonner aux utilisateurs en ligne
    const onlineSubscription = this.chatService.onlineUsers$.subscribe(users => {
      this.otherUserOnline = users.some(userId => userId !== this.currentUserId);
    });
    this.subscriptions.push(onlineSubscription);

    // Marquer les messages actuels comme lus
    this.markCurrentStepMessagesAsRead();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.disconnect();
  }

  get isAdmin(): boolean {
    return this.currentUserRole === 'admin';
  }

  get isAuditor(): boolean {
    return this.currentUserRole === 'auditor' || this.currentUserRole === 'auditeur';
  }

  // Mettre à jour les messages de l'étape courante
  private updateCurrentStepMessages(): void {
    this.currentStepMessages = this.chatService.getStepMessages(this.currentStep);
  }

  // Mettre à jour le nombre total de messages non lus
  private updateUnreadCount(): void {
    this.totalUnreadCount = this.chatService.getUnreadCount();
  }

  // Obtenir le nombre de messages non lus pour une étape
  getStepUnreadCount(stepIndex: number): number {
    return this.chatService.getUnreadCount(stepIndex);
  }

  // Changer d'étape
  switchToStep(stepIndex: number): void {
    this.currentStep = stepIndex;
    this.updateCurrentStepMessages();
    this.markCurrentStepMessagesAsRead();
    setTimeout(() => this.scrollToBottom(), 100);
  }

  // Basculer l'état minimisé du chat
  toggleChat(): void {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      this.markCurrentStepMessagesAsRead();
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  // Envoyer un message
  sendMessage(): void {
    if (!this.newMessage.trim() || this.isSending) return;

    this.isSending = true;

    const message: ChatMessage = {
      id: this.generateMessageId(),
      opportunityId: this.opportunityId,
      stepIndex: this.currentStep,
      stepName: this.stepNames[this.currentStep],
      senderRole: this.currentUserRole as 'admin' | 'auditor',
      senderName: this.getCurrentUserName(),
      senderId: this.currentUserId,
      message: this.newMessage.trim(),
      timestamp: new Date(),
      messageType: 'info',
      isRead: false
    };

    this.chatService.sendMessage(message).subscribe({
      next: () => {
        this.newMessage = '';
        this.isSending = false;
        this.chatService.setTypingStatus(false);
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
        this.isSending = false;
      }
    });
  }

  // Gérer la pression de touches
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Gérer la frappe
  onTyping(): void {
    this.chatService.setTypingStatus(true);

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.chatService.setTypingStatus(false);
    }, 3000);
  }

  // Marquer les messages de l'étape courante comme lus
  private markCurrentStepMessagesAsRead(): void {
    this.chatService.markMessagesAsRead(this.currentStep, this.currentUserId);
    this.updateUnreadCount();
  }

  // Faire défiler jusqu'au bas
  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  // Formater l'heure
  formatTime(timestamp: Date): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diff = now.getTime() - messageTime.getTime();

    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return messageTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return messageTime.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Générer un ID de message unique
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obtenir l'ID utilisateur actuel
  private getCurrentUserId(): string {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id || userData.username || `user_${Date.now()}`;
      } catch {
        return localStorage.getItem('userId') || `user_${Date.now()}`;
      }
    }
    return localStorage.getItem('userId') || `user_${Date.now()}`;
  }

  // Obtenir le nom utilisateur actuel
  @Input() opportunity!: any;
  private getCurrentUserName(): string {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.username || userData.name || userData.firstName || 'Utilisateur';
      } catch {
        return localStorage.getItem('username') || 'Utilisateur';
      }
    }
    return localStorage.getItem('username') || 'Utilisateur';
  }
}