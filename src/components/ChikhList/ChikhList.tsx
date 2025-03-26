import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../services/firebaseService';

interface Chikh {
  id: string;
  name: string;
  description: string;
}

interface ChikhListProps {
  onSelectChikh: (chikh: Chikh) => void;
}

const ChikhList: React.FC<ChikhListProps> = ({ onSelectChikh }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chikhs, setChikhs] = useState<Chikh[]>([]);

  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToChikhs((chikhsList) => {
      setChikhs(chikhsList);
    });

    return () => unsubscribe();
  }, []);

  const filteredChikhs = chikhs.filter(chikh =>
    chikh.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search Chikhs..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-2">
        {filteredChikhs.map(chikh => (
          <div
            key={chikh.id}
            onClick={() => onSelectChikh(chikh)}
            className="p-3 border rounded cursor-pointer hover:bg-gray-100"
          >
            <h3 className="font-bold">{chikh.name}</h3>
            <p className="text-sm text-gray-600">{chikh.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChikhList;