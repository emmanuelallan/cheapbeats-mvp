"use client";

import { useState } from "react";
import { CreateBeatForm } from "@/components/beats/createBeatForm";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

export function AdminControls() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Beat Management</CardTitle>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? (
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              <span>Close Form</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New Beat</span>
            </span>
          )}
        </Button>
      </CardHeader>
      {showCreateForm && (
        <CreateBeatForm onSuccess={() => setShowCreateForm(false)} />
      )}
    </>
  );
}
