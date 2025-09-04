
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, timeout } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';


const socket = new SockJS('http://localhost:8080/ws-chat');

// Crée le client STOMP avec le type CompatClient
const client: CompatClient = Stomp.over(socket);

client.reconnectDelay = 5000;

client.connect({}, () => {
  console.log('STOMP connected!');
  client.subscribe('/topic/chat/1', (message) => {
    console.log('Message reçu :', message.body);
  });
});
export interface ChatMessage {
  id?: number;
  messageId: string;
  opportunityId: number;
  stepIndex: number;
  stepName: string;
  senderRole: 'admin' | 'auditor';
  senderName: string;
  senderId: string;
  message: string;
  timestamp: Date | string;
  messageType: 'question' | 'response' | 'info' | 'requirement' | 'system';
  isRead: boolean;
  attachments?: string[];
}

export interface ChatUnreadCount {
  totalUnread: number;
  stepUnreadCounts: { [stepIndex: number]: number };
}

@Component({
  selector: 'app-pipeline-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-widget" [class.expanded]="isExpanded" [class.minimized]="!isExpanded">

      <!-- Chat Toggle Button (floating) -->
      <button
          class="chat-toggle-btn"
          (click)="toggleChat()"
          [class.has-notifications]="totalUnreadCount > 0">

        <i class="fas fa-comments chat-icon"></i>
        <div class="unread-bubble" *ngIf="totalUnreadCount > 0">
          {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
        </div>

        <!-- Pulse animation for new messages -->
        <div class="pulse-ring" *ngIf="hasNewMessage"></div>
      </button>

      <!-- Chat Container -->
      <div class="chat-container" *ngIf="isExpanded">

        <!-- Connection Status -->
        <div class="connection-status error" *ngIf="connectionError">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ connectionError }}</span>
        </div>

        <div class="connection-status warning" *ngIf="!isConnected && !connectionError">
          <i class="fas fa-wifi"></i>
          <span>Reconnexion en cours...</span>
        </div>

        <!-- Chat Header -->
        <div class="chat-header">
          <div class="header-left">
            <div class="chat-title">
              <i class="fas fa-comments"></i>
              <span>Pipeline Chat</span>
            </div>
            <div class="online-status" *ngIf="otherUserOnline">
              <div class="status-indicator online"></div>
              <span>{{ otherUserName }} online</span>
            </div>
          </div>

          <div class="header-actions">
            <button class="action-btn" (click)="refreshChat()" [disabled]="isLoading">
              <i class="fas fa-sync-alt" [class.fa-spin]="isLoading"></i>
            </button>
            <button class="action-btn minimize-btn" (click)="toggleChat()">
              <i class="fas fa-minus"></i>
            </button>
          </div>
        </div>

        <!-- Step Navigation Tabs -->
        <div class="step-tabs">
          <button
              *ngFor="let stepName of stepNames; let i = index"
              class="step-tab"
              [class.active]="currentStep === i"
              [class.has-unread]="getStepUnreadCount(i) > 0"
              (click)="switchToStep(i)">

            <span class="step-number">{{ i + 1 }}</span>
            <span class="step-name">{{ getShortStepName(stepName) }}</span>

            <div class="step-unread-badge" *ngIf="getStepUnreadCount(i) > 0">
              {{ getStepUnreadCount(i) }}
            </div>
          </button>
        </div>

        <!-- Messages Area -->
        <div class="messages-area">
          <div class="messages-header">
            <h4>{{ stepNames[currentStep] }}</h4>
            <div class="participants-info">
              <div class="participant admin" [class.active]="currentUserRole === 'admin'">
                <i class="fas fa-user-shield"></i>
                <span>Admin</span>
              </div>
              <div class="participant auditor" [class.active]="currentUserRole === 'auditor'">
                <i class="fas fa-user-check"></i>
                <span>Auditeur</span>
              </div>
            </div>
          </div>

          <div class="messages-container" #messagesContainer>
            <!-- Loading Messages -->
            <div class="loading-messages" *ngIf="isLoadingMessages">
              <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Chargement des messages...</span>
              </div>
            </div>

            <!-- Error State -->
            <div class="error-state" *ngIf="apiError && !isLoadingMessages">
              <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <p class="error-title">Erreur de connexion</p>
              <p class="error-subtitle">{{ apiError }}</p>
              <button class="retry-btn" (click)="retryConnection()">
                <i class="fas fa-sync-alt"></i>
                Réessayer
              </button>
            </div>

            <!-- Empty State -->
            <div class="empty-state" *ngIf="currentStepMessages.length === 0 && !isLoadingMessages && !apiError">
              <div class="empty-icon">
                <i class="fas fa-comments"></i>
              </div>
              <p class="empty-title">Aucun message</p>
              <p class="empty-subtitle">Commencez la conversation pour cette étape</p>
            </div>

            <!-- Messages List -->
            <div class="messages-list" *ngIf="!apiError">
              <div
                  *ngFor="let message of currentStepMessages; trackBy: trackByMessageId"
                  class="message-wrapper"
                  [class.own]="message.senderId === currentUserId"
                  [class.other]="message.senderId !== currentUserId">

                <div class="message-bubble"
                     [class.admin]="message.senderRole === 'admin'"
                     [class.auditor]="message.senderRole === 'auditor'"
                     [class.system]="message.messageType === 'system'">

                  <div class="message-header" *ngIf="message.senderId !== currentUserId">
                    <div class="sender-info">
                      <i class="fas fa-user-shield" *ngIf="message.senderRole === 'admin'"></i>
                      <i class="fas fa-user-check" *ngIf="message.senderRole === 'auditor'"></i>
                      <span class="sender-name">{{ message.senderName }}</span>
                    </div>
                    <span class="message-time">{{ formatMessageTime(message.timestamp) }}</span>
                  </div>

                  <div class="message-content">
                    <p>{{ message.message }}</p>

                    <!-- Attachments -->
                    <div class="message-attachments" *ngIf="message.attachments && message.attachments.length > 0">
                      <div class="attachment" *ngFor="let attachment of message.attachments">
                        <i class="fas fa-paperclip"></i>
                        <span>{{ attachment }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="message-footer" *ngIf="message.senderId === currentUserId">
                    <span class="message-time">{{ formatMessageTime(message.timestamp) }}</span>
                    <div class="message-status">
                      <i class="fas fa-check" *ngIf="message.isRead"></i>
                      <i class="fas fa-circle" *ngIf="!message.isRead"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div class="typing-indicator" *ngIf="isOtherUserTyping">
              <div class="typing-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="typing-bubble">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <span class="typing-text">{{ otherUserName }} écrit...</span>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="message-input-area">
          <div class="input-container">
            <div class="input-wrapper">
              <textarea
                  class="message-input"
                  [(ngModel)]="newMessage"
                  placeholder="Tapez votre message..."
                  (keydown)="onKeyDown($event)"
                  (input)="onTyping()"
                  [disabled]="isSending || !isConnected"
                  rows="1"
                  #messageInput></textarea>

              <div class="input-actions">
                <button class="attach-btn" title="Joindre un fichier">
                  <i class="fas fa-paperclip"></i>
                </button>

                <button
                    class="send-btn"
                    (click)="sendMessage()"
                    [disabled]="!canSendMessage()"
                    [class.sending]="isSending">

                  <i class="fas fa-paper-plane" *ngIf="!isSending"></i>
                  <i class="fas fa-spinner fa-spin" *ngIf="isSending"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions" *ngIf="showQuickActions">
            <button class="quick-action" (click)="insertQuickMessage('Merci pour cette information.')">
              <span>👍 Merci</span>
            </button>
            <button class="quick-action" (click)="insertQuickMessage('Pouvez-vous clarifier ce point ?')">
              <span>❓ Clarification</span>
            </button>
            <button class="quick-action" (click)="insertQuickMessage('Document reçu et en cours de révision.')">
              <span>📄 Document reçu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .chat-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      position: relative;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }

    .chat-toggle-btn.has-notifications {
      animation: bounce 2s infinite;
    }

    .chat-icon {
      font-size: 24px;
    }

    .unread-bubble {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ff4757;
      color: white;
      border-radius: 12px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid #ff4757;
      border-radius: 50%;
      animation: pulse 1.5s ease-out infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-5px);
      }
      60% {
        transform: translateY(-3px);
      }
    }

    .chat-container {
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      position: absolute;
      bottom: 80px;
      right: 0;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chat-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 16px;
    }

    .online-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      opacity: 0.9;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #2ed573;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .step-tabs {
      background: #f8f9fa;
      padding: 12px;
      display: flex;
      gap: 4px;
      overflow-x: auto;
      border-bottom: 1px solid #e9ecef;
    }

    .step-tab {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      position: relative;
      min-width: fit-content;
      font-size: 12px;
    }

    .step-tab.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .step-tab.has-unread {
      border-color: #ff4757;
    }

    .step-number {
      background: rgba(0, 0, 0, 0.1);
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
    }

    .step-tab.active .step-number {
      background: rgba(255, 255, 255, 0.3);
    }

    .step-name {
      font-weight: 500;
    }

    .step-unread-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #ff4757;
      color: white;
      border-radius: 10px;
      padding: 2px 5px;
      font-size: 9px;
      font-weight: bold;
      min-width: 16px;
      text-align: center;
    }

    .messages-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .messages-header {
      padding: 12px 16px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .messages-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #495057;
    }

    .participants-info {
      display: flex;
      gap: 8px;
    }

    .participant {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      background: #f8f9fa;
      color: #6c757d;
    }

    .participant.active {
      background: #e7f3ff;
      color: #0066cc;
    }

    .participant.admin.active {
      background: #fff3cd;
      color: #856404;
    }

    .participant.auditor.active {
      background: #d4edda;
      color: #155724;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      scroll-behavior: smooth;
    }

    .loading-messages {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #6c757d;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
      color: #6c757d;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.3;
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .empty-subtitle {
      font-size: 14px;
      margin: 0;
      opacity: 0.8;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
    }

    .message-wrapper.own {
      align-items: flex-end;
    }

    .message-wrapper.other {
      align-items: flex-start;
    }

    .message-bubble {
      max-width: 280px;
      border-radius: 18px;
      padding: 12px 16px;
      position: relative;
    }

    .message-wrapper.own .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .message-wrapper.other .message-bubble {
      background: #f8f9fa;
      color: #495057;
    }

    .message-bubble.admin {
      border-left: 4px solid #ffc107;
    }

    .message-bubble.auditor {
      border-left: 4px solid #28a745;
    }

    .message-bubble.system {
      background: #e3f2fd;
      color: #1976d2;
      text-align: center;
      font-style: italic;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .sender-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .sender-name {
      color: #495057;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
    }

    .message-content {
      margin: 0;
    }

    .message-content p {
      margin: 0;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .message-attachments {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .attachment {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      font-size: 12px;
    }

    .message-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      font-size: 11px;
    }

    .message-status {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 0;
      color: #6c757d;
      font-size: 12px;
    }

    .typing-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .typing-bubble {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 8px 12px;
    }

    .typing-dots {
      display: flex;
      gap: 3px;
    }

    .typing-dots span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6c757d;
      animation: typing 1.4s ease-in-out infinite;
    }

    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }

    .message-input-area {
      border-top: 1px solid #e9ecef;
      padding: 16px;
      background: white;
    }

    .input-container {
      background: #f8f9fa;
      border-radius: 24px;
      padding: 4px;
    }

    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    .message-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 12px 16px;
      resize: none;
      outline: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.4;
      max-height: 120px;
      min-height: 44px;
    }

    .input-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
    }

    .attach-btn, .send-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .attach-btn {
      background: transparent;
      color: #6c757d;
    }

    .attach-btn:hover {
      background: #e9ecef;
    }

    .send-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .send-btn:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .send-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .send-btn.sending {
      background: #6c757d;
    }

    .quick-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      overflow-x: auto;
      padding: 4px 0;
    }

    .quick-action {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 16px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .quick-action:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
    }

    .connection-status {
      background: #fff3cd;
      color: #856404;
      padding: 8px 16px;
      text-align: center;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .messages-container::-webkit-scrollbar {
      width: 6px;
    }

    .messages-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .messages-container::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .messages-container::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

   
    @media (max-width: 480px) {
      .chat-container {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0;
        position: fixed;
      }

      .chat-widget {
        bottom: 10px;
        right: 10px;
      }
    }
  `]
})
export class PipelineChatComponent implements OnInit, OnDestroy {
  @Input() opportunityId!: number;
  @Input() currentStep: number = 0;
  @Input() currentUserRole: string = '';
  @Input() opportunity: any;

  @Output() unreadCountChange = new EventEmitter<number>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // Constants
  private readonly API_BASE = '/api/chat';
  private readonly WS_ENDPOINT = '/ws-chat';
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private readonly MAX_RETRY_ATTEMPTS = 3;

  stepNames = [
    'Opportunity Review',
    'Potential Application',
    'Proposal',
    'Negotiation',
    'Contract'
  ];

  // Component State
  isExpanded = false;
  currentStepMessages: ChatMessage[] = [];
  newMessage = '';
  isSending = false;
  isLoading = false;
  isLoadingMessages = false;
  isConnected = false;
  hasNewMessage = false;
  connectionError = '';
  apiError = '';

  // User State
  currentUserId = '';
  otherUserName = '';
  otherUserOnline = false;
  isOtherUserTyping = false;

  // Unread Counts
  totalUnreadCount = 0;
  unreadCounts: { [stepIndex: number]: number } = {};

  // UI State
  showQuickActions = false;

  // WebSocket
  private stompClient: CompatClient | null = null;
  private subscriptions: Subscription[] = [];
  private typingTimeout: any;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private retryAttempts = 0;

  constructor(private http: HttpClient) {
    this.currentUserId = this.getCurrentUserId();
    this.otherUserName = this.currentUserRole === 'admin' ? 'Auditeur' : 'Admin';
  }

  ngOnInit(): void {
    this.initializeChat();
    this.connectWebSocket();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.stompClient?.disconnect(() => console.log('WebSocket disconnected'));
  }

  // === Initialization Methods ===

  private initializeChat(): void {
    console.log('Initializing chat for opportunity:', this.opportunityId);
    if (!this.opportunityId) {
      this.apiError = 'ID d\'opportunité manquant';
      return;
    }
    this.loadMessages();
    this.loadUnreadCounts();
  }

  private connectWebSocket(): void {
    try {
      // Add error handling for SockJS connection
      const socket = new SockJS(this.WS_ENDPOINT);

      socket.onopen = () => {
        console.log('SockJS connection opened');
        this.connectionError = '';
      };

      socket.onerror = (error: any) => {
        console.error('SockJS connection error:', error);
        this.connectionError = 'Erreur de connexion WebSocket';
      };

      this.stompClient = Stomp.over(socket);

      // Disable debug in production
      this.stompClient.configure({
        debug: (str: string) => {
          if (str.includes('ERROR') || str.includes('error')) {
            console.error('STOMP Error:', str);
          } else {
            console.log('STOMP Debug:', str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.connect({},
          (frame: any) => this.onWebSocketConnected(frame),
          (error: any) => this.onWebSocketError(error)
      );
    } catch (error) {
      console.error('Failed to initialize WebSocket connection:', error);
      this.connectionError = 'Impossible de se connecter au chat';
    }
  }

  private onWebSocketConnected(frame: any): void {
    console.log('WebSocket Connected:', frame);
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.connectionError = '';

    try {
      // Subscribe to chat messages
      const chatTopic = `/topic/chat/${this.opportunityId}`;
      this.stompClient?.subscribe(chatTopic, (message: any) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          this.handleIncomingMessage(chatMessage);
        } catch (parseError) {
          console.error('Error parsing chat message:', parseError);
        }
      });

      // Subscribe to typing indicators
      const typingTopic = `/topic/typing/${this.opportunityId}`;
      this.stompClient?.subscribe(typingTopic, (message: any) => {
        try {
          const typingInfo = JSON.parse(message.body);
          this.handleTypingIndicator(typingInfo);
        } catch (parseError) {
          console.error('Error parsing typing indicator:', parseError);
        }
      });
    } catch (subscriptionError) {
      console.error('Error setting up WebSocket subscriptions:', subscriptionError);
      this.connectionError = 'Erreur lors de l\'abonnement aux messages';
    }
  }

  private onWebSocketError(error: any): void {
    console.error('WebSocket Error:', error);
    this.isConnected = false;

    if (error && error.toString().includes('404')) {
      this.connectionError = 'Service de chat indisponible (404)';
    } else {
      this.connectionError = 'Erreur de connexion au chat';
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = 5000 * this.reconnectAttempts;
      console.log(`Attempting reconnection in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connectWebSocket(), delay);
    } else {
      this.connectionError = 'Connexion au chat échouée après plusieurs tentatives';
    }
  }

  // === Data Loading Methods ===

  private loadInitialData(): void {
    this.loadMessages();
    this.loadUnreadCounts();
  }

  private loadMessages(): void {
    if (this.isLoadingMessages) return;

    this.isLoadingMessages = true;
    this.apiError = '';
    const url = `${this.API_BASE}/messages/${this.opportunityId}?stepIndex=${this.currentStep}`;

    this.http.get<ChatMessage[]>(url, {
      headers: this.getAuthHeaders(),
      responseType: 'json' // Explicitly set response type
    })
        .pipe(
            timeout(this.REQUEST_TIMEOUT),
            retry(2),
            catchError((error: HttpErrorResponse) => this.handleHttpError(error, 'loading messages'))
        )
        .subscribe({
          next: (messages) => {
            console.log('Messages loaded successfully:', messages);
            this.currentStepMessages = Array.isArray(messages) ? messages : [];
            this.markCurrentStepAsRead();
            this.retryAttempts = 0;
            setTimeout(() => this.scrollToBottom(), 100);
            this.isLoadingMessages = false;
            this.apiError = '';
          },
          error: (error) => {
            console.error('Error loading messages:', error);
            this.isLoadingMessages = false;
            this.apiError = this.getErrorMessage(error);
          }
        });
  }

  private loadUnreadCounts(): void {
    const url = `${this.API_BASE}/unread-count/${this.opportunityId}`;

    this.http.get<ChatUnreadCount>(url, {
      headers: this.getAuthHeaders(),
      responseType: 'json'
    })
        .pipe(
            timeout(this.REQUEST_TIMEOUT),
            retry(1),
            catchError((error: HttpErrorResponse) => this.handleHttpError(error, 'loading unread counts'))
        )
        .subscribe({
          next: (counts) => {
            console.log('Unread counts loaded:', counts);
            this.totalUnreadCount = counts.totalUnread || 0;
            this.unreadCounts = counts.stepUnreadCounts || {};
            this.unreadCountChange.emit(this.totalUnreadCount);
          },
          error: (error) => {
            console.error('Error loading unread counts:', error);
          }
        });
  }

  // === Error Handling Methods ===

  private handleHttpError(error: HttpErrorResponse, context: string) {
    let errorMessage = 'Erreur de connexion';

    if (error.status === 0) {
      errorMessage = 'Impossible de contacter le serveur';
    } else if (error.status === 401) {
      errorMessage = 'Session expirée, veuillez vous reconnecter';
      this.handleAuthError();
    } else if (error.status === 403) {
      errorMessage = 'Accès refusé';
    } else if (error.status === 404) {
      errorMessage = 'Service non disponible';
    } else if (error.status >= 500) {
      errorMessage = 'Erreur du serveur';
    }  else if ((error as any).name === 'TimeoutError') {
      errorMessage = 'Délai d\'attente dépassé';
    }

    console.error(`HTTP Error in ${context}:`, error);
    return throwError(() => new Error(errorMessage));
  }



  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    return 'Une erreur inattendue s\'est produite';
  }

  // === Message Handling Methods ===

  sendMessage(): void {
    if (!this.canSendMessage()) return;

    this.isSending = true;
    const messageText = this.newMessage.trim();

    const message: ChatMessage = {
      messageId: this.generateMessageId(),
      opportunityId: this.opportunityId,
      stepIndex: this.currentStep,
      stepName: this.stepNames[this.currentStep],
      senderRole: this.currentUserRole as 'admin' | 'auditor',
      senderName: this.getCurrentUserName(),
      senderId: this.currentUserId,
      message: messageText,
      timestamp: new Date(),
      messageType: 'info',
      isRead: false
    };

    const url = `${this.API_BASE}/send`;

    this.http.post<ChatMessage>(url, message, {
      headers: this.getAuthHeaders(),
      responseType: 'json'
    })
        .pipe(
            timeout(this.REQUEST_TIMEOUT),
            catchError((error: HttpErrorResponse) => this.handleHttpError(error, 'sending message'))
        )
        .subscribe({
          next: (savedMessage) => {
            console.log('Message sent successfully:', savedMessage);
            this.currentStepMessages.push(savedMessage);
            this.newMessage = '';
            this.stopTyping();
            setTimeout(() => this.scrollToBottom(), 100);
            this.isSending = false;
          },
          error: (error) => {
            console.error('Error sending message:', error);
            this.isSending = false;
            // Show user-friendly error
            this.showErrorMessage('Impossible d\'envoyer le message: ' + this.getErrorMessage(error));
          }
        });
  }

  // === UI Methods ===

  retryConnection(): void {
    this.apiError = '';
    this.connectionError = '';
    this.retryAttempts++;

    if (this.retryAttempts <= this.MAX_RETRY_ATTEMPTS) {
      this.loadMessages();
      this.loadUnreadCounts();
      this.connectWebSocket();
    } else {
      this.apiError = 'Impossible de se connecter après plusieurs tentatives';
    }
  }

  canSendMessage(): boolean {
    return !this.isSending &&
        this.newMessage.trim().length > 0 &&
        this.newMessage.trim().length <= 1000 &&
        this.isConnected &&
        !this.apiError;
  }

  private showErrorMessage(message: string): void {
    console.error('Chat Error:', message);
    // You could implement a toast notification here
  }

  // === Utility Methods ===

  private getCurrentUserId(): string {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.id?.toString() || userData.username || `user_${Date.now()}`;
      } catch {
        return localStorage.getItem('userId') || `user_${Date.now()}`;
      }
    }
    return localStorage.getItem('userId') || `user_${Date.now()}`;
  }

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



  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // === Rest of your existing methods ===

  toggleChat(): void {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.markCurrentStepAsRead();
      this.hasNewMessage = false;
      setTimeout(() => {
        this.scrollToBottom();
        this.focusMessageInput();
      }, 300);
    }
  }

  switchToStep(stepIndex: number): void {
    if (stepIndex === this.currentStep) return;

    this.currentStep = stepIndex;
    this.loadMessages();
    this.markCurrentStepAsRead();
  }

  refreshChat(): void {
    this.isLoading = true;
    this.apiError = '';
    this.loadMessages();
    this.loadUnreadCounts();

    // Set a timeout to reset loading state
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  // === Input Handling Methods ===

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'Escape') {
      this.showQuickActions = false;
    }
  }

  onTyping(): void {
    this.sendTypingIndicator(true);

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.sendTypingIndicator(false);
    }, 3000);
  }

  private stopTyping(): void {
    clearTimeout(this.typingTimeout);
    this.sendTypingIndicator(false);
  }

  private sendTypingIndicator(isTyping: boolean): void {
    if (!this.isConnected || !this.stompClient) return;

    try {
      const typingData = {
        opportunityId: this.opportunityId,
        userId: this.currentUserId,
        userName: this.getCurrentUserName(),
        isTyping: isTyping,
        timestamp: Date.now()
      };

      this.stompClient.send('/app/chat.typing', {}, JSON.stringify(typingData));
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }

  insertQuickMessage(message: string): void {
    this.newMessage = message;
    this.showQuickActions = false;
    this.focusMessageInput();
  }

  private handleIncomingMessage(message: ChatMessage): void {
    if (message.senderId === this.currentUserId) return;

    if (message.stepIndex === this.currentStep) {
      this.currentStepMessages.push(message);
      setTimeout(() => this.scrollToBottom(), 100);
      this.markMessageAsRead(message);
    }

    // Update unread counts
    this.loadUnreadCounts();

    // Show notification effect
    this.triggerNewMessageEffect();
  }

  private handleTypingIndicator(typingInfo: any): void {
    if (typingInfo.userId === this.currentUserId) return;

    this.isOtherUserTyping = typingInfo.isTyping;

    if (this.isOtherUserTyping) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  // === Utility Methods ===

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.messageId;
  }

  getShortStepName(stepName: string): string {
    const shortNames: { [key: string]: string } = {
      'Opportunity Review': 'Review',
      'Potential Application': 'Potential',
      'Proposal': 'Proposal',
      'Negotiation': 'Negotiation',
      'Contract': 'Contract'
    };
    return shortNames[stepName] || stepName;
  }

  getStepUnreadCount(stepIndex: number): number {
    return this.unreadCounts[stepIndex] || 0;
  }

  formatMessageTime(timestamp: Date | string): string {
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h`;
    }

    return messageTime.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // === Read Status Methods ===

  private markCurrentStepAsRead(): void {
    if (!this.isExpanded) return;

    const url = `${this.API_BASE}/mark-read/${this.opportunityId}?stepIndex=${this.currentStep}`;

    this.http.put<void>(url, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'json' as 'json'
    })
        .pipe(
            timeout(this.REQUEST_TIMEOUT),
            catchError((error: HttpErrorResponse) => {
              console.error('Error marking messages as read:', error);
              return of(null); // Continue silently for read status errors
            })
        )
        .subscribe({
          next: () => {
            this.loadUnreadCounts();
          },
          error: (error) => {
            console.error('Error marking messages as read:', error);
          }
        });
  }

  private markMessageAsRead(message: ChatMessage): void {
    if (message.senderId === this.currentUserId) return;
    if (message.isRead) return;

    message.isRead = true;
    // Update in backend will be handled by markCurrentStepAsRead when step becomes active
  }

  // === UI Effects Methods ===

  private triggerNewMessageEffect(): void {
    this.hasNewMessage = true;
    setTimeout(() => {
      this.hasNewMessage = false;
    }, 3000);
  }

  private scrollToBottom(): void {
    if (!this.messagesContainer) return;

    try {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }

  private focusMessageInput(): void {
    if (!this.messageInput) return;

    try {
      setTimeout(() => {
        this.messageInput.nativeElement.focus();
      }, 100);
    } catch (error) {
      console.error('Error focusing message input:', error);
    }
  }

  // === Cleanup Methods ===

  private cleanup(): void {
    // Clear timeouts
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Unsubscribe from observables
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    // Disconnect WebSocket
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect();
    }
  }

  // === Public API Methods (for parent component) ===

  public openChatForStep(stepIndex: number): void {
    this.currentStep = stepIndex;
    this.isExpanded = true;
    this.loadMessages();
    setTimeout(() => {
      this.scrollToBottom();
      this.focusMessageInput();
    }, 300);
  }

  public minimizeChat(): void {
    this.isExpanded = false;
  }

  public getTotalUnreadCount(): number {
    return this.totalUnreadCount;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // === Admin/System Methods ===

  public sendSystemMessage(message: string, stepIndex?: number): void {
    const systemMessage: ChatMessage = {
      messageId: this.generateMessageId(),
      opportunityId: this.opportunityId,
      stepIndex: stepIndex !== undefined ? stepIndex : this.currentStep,
      stepName: this.stepNames[stepIndex !== undefined ? stepIndex : this.currentStep],
      senderRole: 'admin',
      senderName: 'System',
      senderId: 'system',
      message: message,
      timestamp: new Date(),
      messageType: 'system',
      isRead: false
    };

    const url = `${this.API_BASE}/send`;

    this.http.post<ChatMessage>(url, systemMessage, {
      headers: this.getAuthHeaders(),
      responseType: 'json'
    })
        .pipe(
            timeout(this.REQUEST_TIMEOUT),
            catchError((error: HttpErrorResponse) => this.handleHttpError(error, 'sending system message'))
        )
        .subscribe({
          next: (savedMessage) => {
            console.log('System message sent:', savedMessage);
          },
          error: (error) => {
            console.error('Error sending system message:', error);
          }
        });
  }

  onChatUnreadCountChange(count: number): void {
    // Optionnel : afficher une notification ou mettre à jour l'UI
    console.log('Total unread messages:', count);
  }
  // In your pipeline-chat.component.ts

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    // Check if token exists and is valid
    if (!token) {
      console.error('No authentication token found');
      this.handleAuthError();
      return new HttpHeaders();
    }

    // Verify token format (basic validation)
    if (!token.startsWith('Bearer ') && token.length > 10) {
      // Auto-prepend Bearer if missing but token seems valid
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }

    return new HttpHeaders({
      'Authorization': token,
      'Content-Type': 'application/json'
    });
  }

// Add better error handling for auth issues
  private handleAuthError(): void {
    this.connectionError = 'Authentication required';
    this.apiError = 'Please login again';

    // Redirect to login after a delay
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }, 2000);
  }

}