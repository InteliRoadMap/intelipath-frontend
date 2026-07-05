import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import profileApi from '@/api/profileApi';

interface UniversitySelectProps {
  value: string; // The current universityId or universityName
  onChange: (id: string, name: string) => void;
  className?: string;
  placeholder?: string;
}

interface University {
  universityId: string;
  name: string;
  code: string;
}

export const UniversitySelect: React.FC<UniversitySelectProps> = ({ value, onChange, className, placeholder }) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await profileApi.getUniversities();
        const data = res.data?.data || res.data || [];
        setOptions(data.map((u: University) => ({ value: u.universityId, label: u.name })));
      } catch (err) {
        console.error("Failed to load universities", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchUniversities();
  }, []);

  const selectedOption = options.find(opt => opt.value === value || opt.label === value) || null;

  return (
    <Select
      className={className}
      placeholder={placeholder || "Select your university..."}
      options={options}
      isLoading={loading}
      value={selectedOption}
      onChange={(opt: any) => {
        if (opt) {
          onChange(opt.value, opt.label);
        } else {
          onChange('', '');
        }
      }}
      isClearable
      styles={{
        control: (base) => ({
          ...base,
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          padding: '2px',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#10b981',
          }
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white',
          color: state.isSelected ? 'white' : '#1e293b',
          cursor: 'pointer'
        })
      }}
    />
  );
};
