import { smsMessageService } from "@/src/services/smsMessageService";
import { SendSmsPayload, SmsStatus } from "@/src/type/smsMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSendSms(apiKey: string) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: SendSmsPayload) => smsMessageService.send(apiKey, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sms', apiKey] }),
    });
}

export function useSms(apiKey: string, id: number) {
    return useQuery({
      queryKey: ['sms', apiKey, id],
      queryFn: () => smsMessageService.show(apiKey, id),
      enabled: !!apiKey && !!id,
    });
}
   
export function useSmsList(apiKey: string, status?: SmsStatus) {
    return useQuery({
        queryKey: ['sms', apiKey, status],
        queryFn: () => smsMessageService.list(apiKey, status),
        enabled: !!apiKey,
    });
}