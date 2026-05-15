import { createActor } from "@/backend";
import type { BookingStatus, RoomBooking, VenueBooking } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useVenueBookings(venueId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VenueBooking[]>({
    queryKey: ["venueBookings", venueId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVenueBookings(venueId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllRoomBookings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RoomBooking[]>({
    queryKey: ["allRoomBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRoomBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVenueBooking() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      venueId: string;
      date: string;
      customerName: string;
      phoneNumber: string;
      aadhaarNumber: string;
      totalAmount: bigint;
      paidAmount: bigint;
      remainingAmount: bigint;
      notes: string;
      bookingStatus: BookingStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addVenueBooking(
        args.venueId,
        args.date,
        args.customerName,
        args.phoneNumber,
        args.aadhaarNumber,
        args.totalAmount,
        args.paidAmount,
        args.remainingAmount,
        args.notes,
        args.bookingStatus,
      );
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["venueBookings", v.venueId] });
      qc.invalidateQueries({ queryKey: ["venueBookedDates", v.venueId] });
    },
  });
}

export function useUpdateVenueBooking() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      venueId: string;
      customerName: string;
      phoneNumber: string;
      aadhaarNumber: string;
      totalAmount: bigint;
      paidAmount: bigint;
      remainingAmount: bigint;
      notes: string;
      bookingStatus: BookingStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVenueBooking(
        args.id,
        args.customerName,
        args.phoneNumber,
        args.aadhaarNumber,
        args.totalAmount,
        args.paidAmount,
        args.remainingAmount,
        args.notes,
        args.bookingStatus,
      );
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["venueBookings", v.venueId] });
      qc.invalidateQueries({ queryKey: ["venueBookedDates", v.venueId] });
    },
  });
}

export function useDeleteVenueBooking() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; venueId: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVenueBooking(args.id);
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["venueBookings", v.venueId] });
      qc.invalidateQueries({ queryKey: ["venueBookedDates", v.venueId] });
    },
  });
}

export function useAddRoomBooking() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      checkInDate: string;
      checkOutDate: string;
      numberOfRooms: bigint;
      customerName: string;
      phoneNumber: string;
      aadhaarNumber: string;
      totalAmount: bigint;
      paidAmount: bigint;
      remainingAmount: bigint;
      notes: string;
      bookingStatus: BookingStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addRoomBooking(
        args.checkInDate,
        args.checkOutDate,
        args.numberOfRooms,
        args.customerName,
        args.phoneNumber,
        args.aadhaarNumber,
        args.totalAmount,
        args.paidAmount,
        args.remainingAmount,
        args.notes,
        args.bookingStatus,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allRoomBookings"] }),
  });
}

export function useDeleteRoomBooking() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRoomBooking(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allRoomBookings"] }),
  });
}
