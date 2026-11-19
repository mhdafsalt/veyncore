'use client';

import Container from '@/components/layout/Container';
import Header from '@/components/common/Header';
import StatusBadge from '@/components/common/StatusBadge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useHealthCheck from '@/hooks/useHealthCheck';
import { API_BASE_URL, TECH_STACK } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const { data, loading, error, lastChecked, refetch } = useHealthCheck(true);

  return (
   <>
   
   </>
  );
}
