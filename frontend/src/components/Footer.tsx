import Link from "next/link";
import { MessageSquare, Code, Hash } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2 md:col-span-2">
            <Link href="/" className="font-bold text-xl text-gray-800 tracking-tight flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-serif">L</div>
              <span>LearnToEarn</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Decentralized learn-to-earn platform powered by Stellar Soroban smart contracts. 
              Complete quests, earn LRN tokens, and master blockchain development.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-blue-500 transition-colors">Dashboard</Link></li>
              <li><Link href="#quests" className="hover:text-blue-500 transition-colors">Quests</Link></li>
              <li><Link href="#activity" className="hover:text-blue-500 transition-colors">Activity Feed</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Community</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="https://github.com/suhanRoy/Stellar-Learn-To-Earn" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <Code size={16} /> GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <Hash size={16} /> Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors flex items-center gap-2">
                  <MessageSquare size={16} /> Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Stellar Learn-to-Earn. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400 justify-center">
            <span>Built on Stellar Soroban</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
