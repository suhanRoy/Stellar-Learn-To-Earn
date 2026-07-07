import { useQuery } from "@tanstack/react-query";
import { TESTNET_RPC, CONTRACT_COURSE_MANAGER, parseScVal } from "@/lib/soroban";
import { rpc, nativeToScVal } from "@stellar/stellar-sdk";

export interface SorobanEvent {
  id: string;
  type: string;
  ledger: number;
  contractId: string;
  topic: string[];
  data: any;
}

export function useSorobanEvents() {
  return useQuery({
    queryKey: ["soroban-events", CONTRACT_COURSE_MANAGER],
    queryFn: async () => {
      const server = new rpc.Server(TESTNET_RPC);
      
      // Fetch latest ledger
      const latestLedgerResponse = await server.getLatestLedger();
      const startLedger = Math.max(1, latestLedgerResponse.sequence - 1000);

      const request: rpc.Api.GetEventsRequest = {
        startLedger,
        filters: [
          {
            type: "contract",
            contractIds: [CONTRACT_COURSE_MANAGER],
            topics: [
                ["*", "*"]
            ]
          },
        ],
        limit: 50,
      };

      try {
          const response = await server.getEvents(request);
          
          if (response.events.length === 0) {
            // Return some mock events to make the UI look alive during the mock phase
            return [
              {
                id: "mock-1",
                type: "contract",
                ledger: startLedger + 50,
                contractId: CONTRACT_COURSE_MANAGER,
                topic: [nativeToScVal("REWARD"), nativeToScVal("CLAIMED")],
                data: nativeToScVal(["GAUT...JO6J", 250]),
              },
              {
                id: "mock-2",
                type: "contract",
                ledger: startLedger + 12,
                contractId: CONTRACT_COURSE_MANAGER,
                topic: [nativeToScVal("COURSE"), nativeToScVal("CREATED")],
                data: nativeToScVal([4, 10000]),
              }
            ].map((evt) => ({
               id: evt.id,
               type: evt.type,
               ledger: evt.ledger,
               contractId: evt.contractId,
               topic: evt.topic.map(t => parseScVal(t)),
               data: parseScVal(evt.data),
            })) as SorobanEvent[];
          }

          return response.events.map((evt) => {
            return {
              id: evt.id,
              type: evt.type,
              ledger: evt.ledger,
              contractId: evt.contractId?.toString() || '',
              topic: evt.topic.map(t => parseScVal(t)),
              data: parseScVal(evt.value),
            } as SorobanEvent;
          });
      } catch (e) {
          console.error("Failed fetching events:", e);
          return [];
      }
    },
    // Poll every 5 seconds for real-time feel
    refetchInterval: 5000,
  });
}
