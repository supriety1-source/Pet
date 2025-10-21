import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export type Act = {
  id: string;
  title: string;
  description: string;
  username: string;
  avatar_url?: string;
  media_url?: string;
  media_type?: string;
  created_at?: string;
  reactions_count?: number;
  comments_count?: number;
  act_date?: string;
  credits_awarded?: number;
  verification_status?: string;
};

type Props = {
  act: Act;
  onReact?: (actId: string) => void;
  onComment?: (actId: string) => void;
  actions?: React.ReactNode;
};

export const ActCard: React.FC<Props> = ({ act, onReact, onComment, actions }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
          {act.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-purple-200">@{act.username}</p>
          <p className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(act.created_at ?? new Date().toISOString()), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{act.title}</h3>
        <p className="mt-2 text-gray-300 whitespace-pre-line">{act.description}</p>
      </div>
      {act.media_url && (
        <div className="rounded-lg overflow-hidden border border-slate-700">
          {act.media_type === 'video' ? (
            <video controls className="w-full">
              <source src={act.media_url} />
            </video>
          ) : (
            <img src={act.media_url} alt={act.title} className="w-full object-cover" />
          )}
        </div>
      )}
      <div className="flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onReact?.(act.id)}
            className="flex items-center gap-2 hover:text-pink-400"
          >
            <Heart className="w-4 h-4" /> {act.reactions_count ?? 0}
          </button>
          <button onClick={() => onComment?.(act.id)} className="flex items-center gap-2 hover:text-purple-300">
            <MessageCircle className="w-4 h-4" /> {act.comments_count ?? 0}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {typeof act.credits_awarded === 'number' && act.credits_awarded > 0 && (
            <span className="text-green-400 font-semibold">+{act.credits_awarded} credits</span>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};
