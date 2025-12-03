import { useEffect } from "react";
import { getFoodCommerceContract, getWeb3 } from "../utils/web3";

export function useOrderEvents(onOrderCreated) {
  useEffect(() => {
    let subscription;
    async function subscribe() {
      try {
        const web3 = getWeb3();
        const contract = getFoodCommerceContract(web3);
        subscription = contract.events
          .OrderCreated()
          .on("data", (event) => {
            onOrderCreated?.(event.returnValues);
          })
          .on("error", console.error);
      } catch (error) {
        console.warn("Unable to listen for events", error);
      }
    }

    subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, [onOrderCreated]);
}

