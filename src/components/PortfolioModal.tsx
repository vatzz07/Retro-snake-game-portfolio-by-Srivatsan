import React from 'react';
import { PortfolioSection } from '../App';

interface PortfolioModalProps {
  section: PortfolioSection;
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  section,
  data,
  isOpen,
  onClose
}) => {
  if (!isOpen || !data) return null;

  const renderAbout = () => (
    <div className="space-y-4">
      <div className="text-center border-b border-green-700 pb-4">
        <h2 className="text-2xl mb-2">{data.content.name}</h2>
        <p className="text-sm text-green-300">{data.content.role}</p>
        <p className="text-xs text-green-400 mt-1">{data.content.location}</p>
      </div>
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">{data.content.summary}</p>
        <div className="bg-green-900/50 p-3 rounded border border-green-700">
          <p className="text-sm font-bold text-green-300">CURRENT POSITION:</p>
          <p className="text-sm">{data.content.currentRole}</p>
          <p className="text-xs text-green-400">{data.content.company} • {data.content.period}</p>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-green-300 mb-2">DESIGN TOOLS:</h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {data.content.designTools.map((skill: string, index: number) => (
              <div key={index} className="bg-green-900/30 p-1 rounded text-center">
                {skill}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-green-300 mb-2">DESIGN SKILLS:</h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {data.content.designSkills.map((skill: string, index: number) => (
              <div key={index} className="bg-green-900/30 p-1 rounded text-center">
                {skill}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-green-300 mb-2">WEB TECHNOLOGIES:</h3>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {data.content.webTechnologies.map((skill: string, index: number) => (
              <div key={index} className="bg-green-900/30 p-1 rounded text-center">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {data.content.map((project: any, index: number) => (
        <div key={index} className="bg-green-900/30 p-3 rounded border border-green-700">
          <h3 className="text-sm font-bold text-green-300">{project.name}</h3>
          <p className="text-xs text-green-400 mb-2">{project.subtitle}</p>
          <p className="text-xs mb-2 leading-relaxed">{project.description}</p>
          <p className="text-xs text-green-300 mb-1">
            <span className="font-bold">FOCUS:</span> {project.focus}
          </p>
          <p className="text-xs text-green-400">
            <span className="font-bold">TOOLS:</span> {project.tools}
          </p>
        </div>
      ))}
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-green-900/30 p-3 rounded border border-green-700 text-center">
          <div className="text-lg mb-1">📧</div>
          <p className="text-sm font-bold text-green-300">EMAIL</p>
          <p className="text-xs break-all">{data.content.email}</p>
        </div>
        <div className="bg-green-900/30 p-3 rounded border border-green-700 text-center">
          <div className="text-lg mb-1">📱</div>
          <p className="text-sm font-bold text-green-300">PHONE</p>
          <p className="text-xs">{data.content.phone}</p>
        </div>
        <div className="bg-green-900/30 p-3 rounded border border-green-700 text-center">
          <div className="text-lg mb-1">🌐</div>
          <p className="text-sm font-bold text-green-300">PORTFOLIO</p>
          <p className="text-xs break-all">{data.content.portfolio}</p>
        </div>
        <div className="bg-green-900/30 p-3 rounded border border-green-700 text-center">
          <div className="text-lg mb-1">📍</div>
          <p className="text-sm font-bold text-green-300">LOCATION</p>
          <p className="text-xs">{data.content.location}</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'about':
        return renderAbout();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      case 'contact':
        return renderContact();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-green-900 border-4 border-green-700 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-green-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{data.icon}</span>
            <h1 className="text-lg font-bold text-green-300 font-mono tracking-wider">
              {data.title}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-green-300 hover:text-green-100 font-mono text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="text-green-100 font-mono text-xs">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-6 pt-4 border-t border-green-700">
          <button
            onClick={onClose}
            className="bg-green-700 hover:bg-green-600 text-green-100 px-6 py-2 rounded font-mono text-xs font-bold border-2 border-green-800"
          >
            CONTINUE GAME
          </button>
        </div>

        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_3px] rounded-lg"></div>
      </div>
    </div>
  );
};