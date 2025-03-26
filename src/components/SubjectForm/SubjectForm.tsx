import React, { useState } from 'react';

interface SubjectFormData {
  name: string;
  description: string;
}

interface SubjectFormProps {
  chikhId: string;
  onSubmit: (data: SubjectFormData & { chikhId: string; createdAt: number }) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ chikhId, onSubmit }) => {
  const [subjectData, setSubjectData] = useState<SubjectFormData>({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...subjectData,
      chikhId,
      createdAt: Date.now()
    });
    setSubjectData({ name: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Subject Name"
        value={subjectData.name}
        onChange={(e) => setSubjectData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Subject Description"
        value={subjectData.description}
        onChange={(e) => setSubjectData(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Subject
      </button>
    </form>
  );
};

export default SubjectForm;