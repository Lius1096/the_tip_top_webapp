// CodeTicket.ts

import Client from "./Client";
import Giveaway from "./Giveaway";

abstract class TicketCode {
  map(arg0: (ticketCode: any) => void) {
    throw new Error("Method not implemented.");
  }
  id?: number;
  label?: string;
  useDate?: string;
  isUsed?: boolean;
  client?: Client;
  giveaway?: Giveaway;
  isRecovered?: boolean;
}

export default TicketCode;
