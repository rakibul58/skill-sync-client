/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import VForm from "@/components/form/VForm";
import VInput from "@/components/form/VInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { Trash2, Pencil } from "lucide-react";
import {
  useCreateSkill,
  useDeleteSkill,
  useSkillList,
  useUpdateSkill,
} from "@/hooks/skill.hook";
import { useCategoryList } from "@/hooks/category.hook";

const skillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function SkillManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: skillsResponse, isLoading: isLoadingSkills } = useSkillList({
    page,
    limit,
    searchTerm,
    categoryId: selectedCategory,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { data: categoriesResponse } = useCategoryList({
    limit: 100,
  });

  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkill();
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  const handleSubmit = (data: any) => {
    if (categoryId) {
      data.categoryId = categoryId;
    }
    if (selectedSkill) {
      updateSkill({
        id: selectedSkill.id,
        data: data,
      });
    } else {
      createSkill(data);
    }
    setSelectedSkill(null);
  };

  const handleDelete = (id: string) => {
    deleteSkill(id);
  };

  // Calculate pagination details
  const totalPages = skillsResponse?.meta
    ? Math.ceil(skillsResponse.meta.total / skillsResponse.meta.limit)
    : 1;

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {(isCreating || isUpdating || isDeleting) && <Loading />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8 items-start"
      >
        {/* Skill Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedSkill ? "Edit Skill" : "Create New Skill"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VForm
              resolver={zodResolver(skillSchema)}
              defaultValues={
                selectedSkill || {
                  name: "",
                  description: "",
                }
              }
              onSubmit={handleSubmit}
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    name="categoryId"
                    defaultValue={selectedSkill?.categoryId || ""}
                    onValueChange={setCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesResponse?.data.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <VInput
                  label="Skill Name"
                  name="name"
                  placeholder="Enter skill name"
                />
                <VInput
                  label="Description"
                  name="description"
                  placeholder="Enter skill description"
                />

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {selectedSkill ? "Update" : "Create"} Skill
                  </Button>
                  {selectedSkill && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSkill(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            </VForm>
          </CardContent>
        </Card>

        {/* Skills List */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <div className="mt-4 flex space-x-4">
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="max-w-sm">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesResponse?.data.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSkills ? (
              <div className="text-center py-4">Loading skills...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skillsResponse?.data.map((skill: any) => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">
                          {skill.name}
                        </TableCell>
                        <TableCell>{skill.description}</TableCell>
                        <TableCell>{skill.category.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSkill(skill)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Skill
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this skill?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(skill.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
