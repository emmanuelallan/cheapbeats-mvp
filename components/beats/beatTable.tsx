"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBeats, deleteBeat } from "@/actions/beats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditBeatForm } from "./editBeatForm";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatDistance } from "date-fns";
import { Beat } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface BeatTableProps {
  initialBeats: Beat[];
}

export function BeatTable({ initialBeats }: BeatTableProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["beats"],
    queryFn: getBeats,
    initialData: {
      beats: initialBeats.map((beat) => ({
        ...beat,
        purchases: [],
      })),
      error: null,
    },
    retry: 1,
    staleTime: 1000 * 60,
  });

  const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
  const { toast } = useToast();
  const [beatToDelete, setBeatToDelete] = useState<Beat | null>(null);

  const handleDelete = async (beat: Beat) => {
    const result = await deleteBeat(beat.id);
    if (result.success) {
      await queryClient.invalidateQueries({ queryKey: ["beats"] });
      toast({
        title: "Success",
        description: "Beat deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete beat",
        variant: "destructive",
      });
    }
    setBeatToDelete(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data.error) {
    return <div>Error: {data.error}</div>;
  }

  const beats = data.beats || [];

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Beat #</TableHead>
              <TableHead>BPM</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beats.map((beat) => (
              <TableRow key={beat.id}>
                <TableCell className="font-medium">{beat.title}</TableCell>
                <TableCell>{beat.beatNumber}</TableCell>
                <TableCell>{beat.bpm}</TableCell>
                <TableCell>{beat.key}</TableCell>
                <TableCell>{beat.genres}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">
                        Non-Exclusive -{" "}
                        <span className="font-mono font-semibold text-gray-900">
                          ${beat.nonExclusivePrice}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">
                        Exclusive -{" "}
                        <span className="font-mono font-semibold text-gray-900">
                          ${beat.exclusivePrice}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-500">
                        Buyout -{" "}
                        <span className="font-mono font-semibold text-gray-900">
                          ${beat.buyoutPrice}
                        </span>
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {beat.stemsUrl && <Badge variant="secondary">Stems</Badge>}
                    {beat.midiUrl && <Badge variant="secondary">MIDI</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      beat.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {beat.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingBeat(beat)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setBeatToDelete(beat)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingBeat} onOpenChange={() => setEditingBeat(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Beat</DialogTitle>
          </DialogHeader>
          {editingBeat && (
            <EditBeatForm
              beat={editingBeat}
              onSuccess={async (updatedBeat: Beat) => {
                await queryClient.invalidateQueries({ queryKey: ["beats"] });
                setEditingBeat(null);
                toast({
                  title: "Success",
                  description: "Beat updated successfully",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!beatToDelete}
        onOpenChange={() => setBeatToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              beat and all associated files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => beatToDelete && handleDelete(beatToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
