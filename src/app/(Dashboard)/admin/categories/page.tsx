/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import VForm from "@/components/form/VForm";
import VInput from "@/components/form/VInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useCategoryList, useCreateCategory, useUpdateCategory } from "@/hooks/category.hook";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [page, setPage] = useState(1);
  const limit = 5;  // Match the API's limit

  const { data: categoriesResponse, isLoading } = useCategoryList({
    page,
    limit,
    searchTerm,
    sortBy: "name",
    sortOrder: "asc",
  });

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const handleSubmit = (data: any) => {
    if (selectedCategory) {
      updateCategory({
        id: selectedCategory.id,
        data: data,
      });
    } else {
      createCategory(data);
    }
    setSelectedCategory(null);
  };

  // Calculate pagination details
  const totalPages = categoriesResponse?.meta ? 
    Math.ceil(categoriesResponse.meta.total / categoriesResponse.meta.limit) : 
    1;

  // Calculate if there are more pages
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {(isCreating || isUpdating) && <Loading />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8 items-start"
      >
        {/* Category Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory ? "Edit Category" : "Create New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VForm
              resolver={zodResolver(categorySchema)}
              defaultValues={selectedCategory || {
                name: "",
                description: "",
              }}
              onSubmit={handleSubmit}
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <VInput
                  label="Category Name"
                  name="name"
                  placeholder="Enter category name"
                />
                <VInput
                  label="Description"
                  name="description"
                  placeholder="Enter category description"
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {selectedCategory ? "Update" : "Create"} Category
                  </Button>
                  {selectedCategory && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            </VForm>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <div className="mt-4">
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading categories...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoriesResponse?.data.map((category: any) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
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