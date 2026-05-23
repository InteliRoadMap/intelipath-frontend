import { useState, useEffect } from 'react';
import { DashboardData } from '../types/dashboard';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fake 1-second delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: DashboardData = {
          overallProgress: 72,
          currentPath: 'Cloud Architect',
          skills: [
            { name: 'System Design', current: 75, target: 90 },
            { name: 'Kubernetes', current: 40, target: 85 },
            { name: 'Go Programming', current: 60, target: 70 },
            { name: 'Cloud Security', current: 30, target: 96 },
          ],
          gaps: [
            {
              id: 'g1',
              type: 'critical',
              tag: 'Critical Gap',
              severity: 'Severe',
              title: 'OAuth 2.0 Security',
              desc: 'Mandatory requirement for 90% of Senior Backend positions.',
            },
            {
              id: 'g2',
              type: 'market',
              tag: 'Market Requirement',
              severity: 'Market demand',
              title: 'Rust Fundamentals',
              desc: 'Increasing by 22% in Fintech job postings this month.',
            }
          ],
          feedbacks: [
            {
              id: 'f1',
              author: 'Sarah Chen',
              role: 'Staff Engineer at Google',
              time: '2 hours ago',
              content: 'Your system design for the microservices project is solid. Next, focus on the CAP theorem trade-offs in your database selection.',
              type: 'positive'
            },
            {
              id: 'f2',
              author: 'Alex Rivera',
              role: 'Cloud Architect',
              time: 'Yesterday',
              content: 'I noticed you struggling with Kubernetes operators. I have added a mandatory lab to your roadmap to help you practice.',
              type: 'warning'
            }
          ]
        };
        
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
