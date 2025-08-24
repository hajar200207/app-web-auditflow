// chat.service.ts - Version améliorée avec persistance correcte
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { ChatMessage } from './pipeline-chat/pipeline-chat.component';

export interface ChatRoom {
    id: string;
    opportunityId: number;
    participants: string[];
    messages: ChatMessage[];
    lastActivity: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = 'api/chat';
    private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
    private typingSubject = new BehaviorSubject<{userId: string, isTyping: boolean}>({userId: '', isTyping: false});
    private onlineUsersSubject = new BehaviorSubject<string[]>([]);

    public messages$ = this.messagesSubject.asObservable();
    public typing$ = this.typingSubject.asObservable();
    public onlineUsers$ = this.onlineUsersSubject.asObservable();

    private currentUserId: string = '';
    private currentOpportunityId: number = 0;
    private pollInterval: any;

    constructor(private http: HttpClient) {
        this.currentUserId = this.getCurrentUserId();

        // Démarrer le polling pour les nouveaux messages
        this.startMessagePolling();
    }

    // Initialiser le chat pour une opportunité
    initializeChat(opportunityId: number, userId: string): void {
        this.currentOpportunityId = opportunityId;
        this.currentUserId = userId;
        this.loadMessagesFromServer();
        this.updateUserOnlineStatus(true);

        // Marquer l'utilisateur comme actif
        this.setUserActivity();
    }

    // Démarrer le polling des messages
    private startMessagePolling(): void {
        this.pollInterval = setInterval(() => {
            if (this.currentOpportunityId > 0) {
                this.loadMessagesFromServer();
                this.checkTypingStatus();
                this.updateOnlineUsers();
            }
        }, 2000); // Vérifier toutes les 2 secondes
    }

    // Charger les messages depuis le localStorage (simulation serveur)
    private loadMessagesFromServer(): void {
        const messagesKey = `chat_messages_${this.currentOpportunityId}`;
        const stored = localStorage.getItem(messagesKey);

        if (stored) {
            try {
                const messages = JSON.parse(stored).map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));

                // Mettre à jour seulement si les messages ont changé
                const currentMessages = this.messagesSubject.value;
                if (messages.length !== currentMessages.length) {
                    this.messagesSubject.next(messages);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des messages:', error);
                this.messagesSubject.next([]);
            }
        } else {
            // Initialiser un tableau vide si aucun message n'existe
            this.messagesSubject.next([]);
        }
    }

    // Envoyer un message avec persistance garantie
    sendMessage(message: ChatMessage): Observable<ChatMessage> {
        return new Observable(observer => {
            try {
                const messagesKey = `chat_messages_${this.currentOpportunityId}`;

                // Récupérer les messages existants
                const stored = localStorage.getItem(messagesKey);
                let existingMessages: ChatMessage[] = [];

                if (stored) {
                    existingMessages = JSON.parse(stored);
                }

                // Ajouter le nouveau message
                const updatedMessages = [...existingMessages, message];

                // Sauvegarder dans localStorage
                localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));

                // Mettre à jour le BehaviorSubject
                const messagesWithDates = updatedMessages.map(m => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                this.messagesSubject.next(messagesWithDates);

                // Créer une notification pour les autres utilisateurs
                this.createNotification(message);

                // Mettre à jour l'activité utilisateur
                this.setUserActivity();

                observer.next(message);
                observer.complete();
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                observer.error(error);
            }
        });
    }

    // Créer une notification pour les autres utilisateurs
    private createNotification(message: ChatMessage): void {
        const notificationKey = `chat_notification_${this.currentOpportunityId}`;
        const notification = {
            messageId: message.id,
            fromUserId: this.currentUserId,
            fromUserName: message.senderName,
            fromUserRole: message.senderRole,
            stepIndex: message.stepIndex,
            stepName: message.stepName,
            messagePreview: message.message.substring(0, 50) + '...',
            timestamp: new Date().getTime(),
            opportunityId: this.currentOpportunityId
        };

        localStorage.setItem(notificationKey, JSON.stringify(notification));
    }

    // Marquer les messages comme lus
    markMessagesAsRead(stepIndex: number, userId: string): void {
        const messagesKey = `chat_messages_${this.currentOpportunityId}`;
        const stored = localStorage.getItem(messagesKey);

        if (!stored) return;

        try {
            const messages = JSON.parse(stored);
            let updated = false;

            const updatedMessages = messages.map((message: ChatMessage) => {
                if (message.stepIndex === stepIndex &&
                    message.senderId !== this.currentUserId &&
                    !message.isRead) {
                    updated = true;
                    return { ...message, isRead: true };
                }
                return message;
            });

            if (updated) {
                localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));
                const messagesWithDates = updatedMessages.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                this.messagesSubject.next(messagesWithDates);
            }
        } catch (error) {
            console.error('Erreur lors du marquage des messages comme lus:', error);
        }
    }

    // Définir le statut de frappe
    setTypingStatus(isTyping: boolean): void {
        const typingKey = `typing_status_${this.currentOpportunityId}_${this.currentUserId}`;
        const typingData = {
            userId: this.currentUserId,
            isTyping: isTyping,
            timestamp: new Date().getTime(),
            userName: this.getCurrentUserName(),
            userRole: this.getCurrentUserRole()
        };

        if (isTyping) {
            localStorage.setItem(typingKey, JSON.stringify(typingData));
        } else {
            localStorage.removeItem(typingKey);
        }

        this.typingSubject.next({
            userId: this.currentUserId,
            isTyping: isTyping
        });
    }

    // Vérifier le statut de frappe des autres utilisateurs
    private checkTypingStatus(): void {
        const typingPattern = `typing_status_${this.currentOpportunityId}_`;
        const keys = Object.keys(localStorage).filter(key =>
            key.startsWith(typingPattern) &&
            !key.includes(this.currentUserId)
        );

        let someoneTyping = false;
        const currentTime = new Date().getTime();

        keys.forEach(key => {
            try {
                const typingData = JSON.parse(localStorage.getItem(key) || '{}');

                // Supprimer les statuts de frappe anciens (plus de 10 secondes)
                if (currentTime - typingData.timestamp > 10000) {
                    localStorage.removeItem(key);
                } else if (typingData.isTyping) {
                    someoneTyping = true;
                    this.typingSubject.next({
                        userId: typingData.userId,
                        isTyping: true
                    });
                }
            } catch (error) {
                localStorage.removeItem(key);
            }
        });

        if (!someoneTyping) {
            this.typingSubject.next({
                userId: '',
                isTyping: false
            });
        }
    }

    // Mettre à jour l'activité utilisateur
    private setUserActivity(): void {
        const activityKey = `user_activity_${this.currentOpportunityId}_${this.currentUserId}`;
        const activityData = {
            userId: this.currentUserId,
            userName: this.getCurrentUserName(),
            userRole: this.getCurrentUserRole(),
            lastActivity: new Date().getTime(),
            isOnline: true
        };

        localStorage.setItem(activityKey, JSON.stringify(activityData));
    }

    // Mettre à jour la liste des utilisateurs en ligne
    private updateOnlineUsers(): void {
        const activityPattern = `user_activity_${this.currentOpportunityId}_`;
        const keys = Object.keys(localStorage).filter(key => key.startsWith(activityPattern));
        const onlineUsers: string[] = [];
        const currentTime = new Date().getTime();

        keys.forEach(key => {
            try {
                const activityData = JSON.parse(localStorage.getItem(key) || '{}');

                // Considérer l'utilisateur en ligne si activité dans les 2 dernières minutes
                if (currentTime - activityData.lastActivity < 120000) {
                    onlineUsers.push(activityData.userId);
                } else {
                    localStorage.removeItem(key);
                }
            } catch (error) {
                localStorage.removeItem(key);
            }
        });

        this.onlineUsersSubject.next(onlineUsers);
    }

    // Mettre à jour le statut en ligne
    updateUserOnlineStatus(isOnline: boolean): void {
        if (isOnline) {
            this.setUserActivity();
        } else {
            const activityKey = `user_activity_${this.currentOpportunityId}_${this.currentUserId}`;
            localStorage.removeItem(activityKey);

            const typingKey = `typing_status_${this.currentOpportunityId}_${this.currentUserId}`;
            localStorage.removeItem(typingKey);
        }
    }

    // Obtenir les messages pour une étape spécifique
    getStepMessages(stepIndex: number): ChatMessage[] {
        return this.messagesSubject.value
            .filter(m => m.opportunityId === this.currentOpportunityId && m.stepIndex === stepIndex)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    // Obtenir le nombre de messages non lus
    getUnreadCount(stepIndex?: number): number {
        const messages = stepIndex !== undefined
            ? this.getStepMessages(stepIndex)
            : this.messagesSubject.value;

        return messages.filter(m =>
            !m.isRead &&
            m.senderId !== this.currentUserId &&
            m.opportunityId === this.currentOpportunityId
        ).length;
    }

    // Vérifier s'il y a de nouvelles notifications
    hasNewNotifications(): boolean {
        const notificationKey = `chat_notification_${this.currentOpportunityId}`;
        const stored = localStorage.getItem(notificationKey);

        if (!stored) return false;

        try {
            const notification = JSON.parse(stored);
            return notification.fromUserId !== this.currentUserId;
        } catch {
            return false;
        }
    }

    // Marquer les notifications comme vues
    markNotificationsAsSeen(): void {
        const notificationKey = `chat_notification_${this.currentOpportunityId}`;
        localStorage.removeItem(notificationKey);
    }

    // Nettoyer lors de la déconnexion
    disconnect(): void {
        this.updateUserOnlineStatus(false);

        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }

    // Méthodes utilitaires privées
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

    private getCurrentUserRole(): string {
        const user = localStorage.getItem('currentUser');
        if (user) {
            try {
                const userData = JSON.parse(user);
                return userData.role || 'auditor';
            } catch {
                return localStorage.getItem('userRole') || 'auditor';
            }
        }
        return localStorage.getItem('userRole') || 'auditor';
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

    // Nettoyer les données anciennes (à appeler périodiquement)
    cleanupOldData(): void {
        const currentTime = new Date().getTime();
        const oneWeekAgo = currentTime - (7 * 24 * 60 * 60 * 1000);

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('chat_') || key.startsWith('typing_') || key.startsWith('user_activity_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key) || '{}');
                    if (data.timestamp && data.timestamp < oneWeekAgo) {
                        localStorage.removeItem(key);
                    }
                } catch {
                    // Si impossible de parser, supprimer la clé
                    localStorage.removeItem(key);
                }
            }
        });
    }
}