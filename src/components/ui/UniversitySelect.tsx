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
        control: (base, state) => ({
          ...base,
          minHeight: '48px',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          paddingLeft: '6px',
          fontWeight: 500,
          boxShadow: state.isFocused ? '0 0 0 4px rgba(99,102,241,0.10)' : 'none',
          borderColor: state.isFocused ? '#818cf8' : '#e2e8f0',
          '&:hover': {
            borderColor: state.isFocused ? '#818cf8' : '#cbd5e1',
          }
        }),
        placeholder: (base) => ({ ...base, color: '#94a3b8' }),
        menu: (base) => ({ ...base, borderRadius: '0.75rem', overflow: 'hidden' }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#eef2ff' : 'white',
          color: state.isSelected ? 'white' : '#1e293b',
          cursor: 'pointer'
        })
      }}
    />
  );
};
