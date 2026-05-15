// CD Orders were removed from the backend. These are kept as no-ops for compatibility.
export function useOrders() {
  return { data: [], isLoading: false, error: null };
}

export function useSubmitOrder() {
  return {
    mutateAsync: async (_args: { name: string; mobile: string }) => BigInt(0),
    isPending: false,
    error: null,
  };
}
