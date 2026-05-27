import React from 'react';

interface MarkdownTextProps {
  text: string;
  isDark: boolean;
}

export function MarkdownText({ text, isDark }: MarkdownTextProps) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listIndex = 0;

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className={`list-disc list-inside space-y-1 my-1.5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, lineIdx) => {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      const content = renderInline(line.slice(2), isDark);
      listItems.push(
        <li key={`li-${lineIdx}`} className="text-sm leading-relaxed">
          {content}
        </li>
      );
    } else if (line.match(/^\d+[\.\)]\s/)) {
      inList = true;
      const content = renderInline(line.replace(/^\d+[\.\)]\s/, ''), isDark);
      listIndex++;
      listItems.push(
        <li key={`li-${lineIdx}`} className="text-sm leading-relaxed">
          <span className="font-semibold mr-1">{listIndex}.</span>
          {content}
        </li>
      );
    } else {
      flushList(`list-end-${lineIdx}`);

      if (line.trim() === '') {
        elements.push(<div key={`empty-${lineIdx}`} className="h-2" />);
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${lineIdx}`} className={`text-base font-bold mt-2 mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {renderInline(line.slice(3), isDark)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${lineIdx}`} className={`text-sm font-bold mt-1.5 mb-0.5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {renderInline(line.slice(4), isDark)}
          </h3>
        );
      } else {
        elements.push(
          <p key={`p-${lineIdx}`} className="text-sm leading-relaxed">
            {renderInline(line, isDark)}
          </p>
        );
      }
    }
  });

  flushList(`list-end-final`);

  return <>{elements}</>;
}

function renderInline(text: string, isDark: boolean): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className={isDark ? 'text-orange-300' : 'text-orange-700'}>{part.slice(2, -2)}</strong>;
    }
    const urlParts = part.split(/(https?:\/\/[^\s]+)/g);
    return urlParts.map((segment, j) => {
      if (segment.match(/^https?:\/\//)) {
        return (
          <a
            key={`${i}-${j}`}
            href={segment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {segment}
          </a>
        );
      }
      return segment;
    });
  });
}
