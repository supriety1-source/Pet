import React from 'react';
import classNames from 'classnames';

type Tab = {
  id: string;
  label: string;
};

type Props = {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
};

export const Tabs: React.FC<Props> = ({ tabs, activeTab, onChange }) => (
  <div className="flex flex-wrap gap-3">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={classNames(
          'px-4 py-2 rounded-full border text-sm uppercase tracking-wide transition',
          activeTab === tab.id
            ? 'bg-purple-500 border-purple-300 text-white shadow-lg shadow-purple-500/30'
            : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-purple-400 hover:text-purple-200'
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
