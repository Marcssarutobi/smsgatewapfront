import { useMutation } from '@tanstack/react-query';
import { smsTestService } from '@/services/smsTestService';

export function useSendTestSms() {
  return useMutation({
    mutationFn: smsTestService.send,
  });
}

export function useSendBulkTestSms() {
  return useMutation({
    mutationFn: smsTestService.sendBulk,
  });
}