import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AIChatBubble } from '../../components/ui/AIChatBubble';
import { Send, Bot, Trash2 } from 'lucide-react';
import { mockAIAssistantChat } from '../../mocks';

export default function AIAssistant() {
  const [chat, setChat] = useState(mockAIAssistantChat);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setChat([...chat, { id: Date.now(), role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setChat(prev => [...prev, { id: Date.now()+1, role: 'ai', content: 'I am a mock AI. I cannot actually answer this right now, but I will in Phase 4!' }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2"><Bot /> Career Mentor AI</h1>
          <p className="text-gray-500 dark:text-gray-400">Ask any technical, HR, or career related questions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setChat([])}><Trash2 size={16} className="mr-2"/> Clear Chat</Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950/50">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[80%]">
                {msg.role === 'user' ? (
                  <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <AIChatBubble isUser={false} message={msg.content} />
                )}
              </div>
            </div>
          ))}
        </CardContent>
        <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <Input className="flex-1" placeholder="Type your question..." value={input} onChange={e => setInput(e.target.value)} />
            <Button type="submit" className="bg-indigo-600 text-white"><Send size={18} /></Button>
          </form>
        </div>
      </Card>
    </div>
  );
}