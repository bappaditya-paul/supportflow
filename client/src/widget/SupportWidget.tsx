import React, { useState } from 'react';
import { WidgetTrigger } from './WidgetTrigger';
import { WidgetHeader } from './WidgetHeader';
import { HomeView } from './views/HomeView';
import { ConversationView } from './views/ConversationView';
import type { Ticket, TimelineItem, DraftResponse } from '../types';

interface SupportWidgetProps {
  embedded?: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  tickets?: Ticket[];
  activeTicket?: Ticket | null;
  timeline?: TimelineItem[];
  draft?: DraftResponse | null;
  isAgentTyping?: boolean;
  onSelectTicket?: (ticketId: string) => void;
  onStartNewChat?: () => void;
  onSendMessage?: (text: string) => void;
  onTyping?: (text: string, isTyping: boolean) => void;
  onTriggerScenario?: (scenario: 'billing' | 'refund' | 'access') => void;
}

export const SupportWidget: React.FC<SupportWidgetProps> = ({
  embedded = false,
  isOpen: controlledIsOpen,
  onToggleOpen,
  tickets = [],
  activeTicket = null,
  timeline = [],
  draft = null,
  isAgentTyping = false,
  onSelectTicket,
  onStartNewChat,
  onSendMessage,
  onTyping,
  onTriggerScenario,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [view, setView] = useState<'home' | 'conversation'>('home');

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleOpen = onToggleOpen || (() => setInternalIsOpen(!internalIsOpen));

  // Sync view when activeTicket changes
  React.useEffect(() => {
    if (activeTicket) {
      setView('conversation');
    }
  }, [activeTicket]);

  const handleStartChat = () => {
    if (onStartNewChat) onStartNewChat();
    setView('conversation');
  };

  const handleSelectTicket = (id: string) => {
    if (onSelectTicket) onSelectTicket(id);
    setView('conversation');
  };

  const handleBackToHome = () => {
    setView('home');
  };

  const widgetContent = (
    <div className="flex flex-col h-full w-full bg-[#0d0e12] rounded-[6px] shadow-2xl border border-white/[0.12] overflow-hidden">
      <WidgetHeader
        title="CloudDesk Support"
        subtitle={view === 'conversation' ? (activeTicket ? activeTicket.ticket_id : 'Active Chat') : 'AI Specialists + Human Team'}
        canGoBack={view === 'conversation'}
        onBack={handleBackToHome}
        onClose={toggleOpen}
      />

      <div className="flex-1 overflow-hidden">
        {view === 'home' || !activeTicket ? (
          <HomeView
            onStartNewChat={handleStartChat}
            onSelectTicket={handleSelectTicket}
            recentTickets={tickets}
            onTriggerScenario={onTriggerScenario || (() => {})}
          />
        ) : (
          <ConversationView
            ticket={activeTicket}
            timeline={timeline}
            draft={draft}
            onSendMessage={onSendMessage || (() => {})}
            onTyping={onTyping || (() => {})}
            isAgentTyping={isAgentTyping}
          />
        )}
      </div>
    </div>
  );

  if (embedded) {
    return <div className="w-full h-full max-h-[640px] flex flex-col">{widgetContent}</div>;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[580px] sm:w-[400px] sm:h-[620px] transition-[transform,opacity] duration-200 motion-reduce:transition-none">
          {widgetContent}
        </div>
      )}
      <WidgetTrigger isOpen={isOpen} onClick={toggleOpen} unreadCount={tickets.filter(t => t.status === 'open').length} />
    </div>
  );
};
