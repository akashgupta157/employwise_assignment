import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "./components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useMemo } from "react";
import { LoaderCircle, Pencil, Trash2, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
});

export default function App() {
  const [userData, setUserData] = useState({
    userList: [],
    loading: true,
    total_pages: 0,
    current_page: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  const fetchData = async () => {
    try {
      setUserData((prev) => ({ ...prev, loading: true }));
      const { data } = await axios.get(
        `https://reqres.in/api/users?page=${userData.current_page}`
      );
      setUserData({
        userList: data.data,
        loading: false,
        total_pages: data.total_pages,
        current_page: data.page,
      });
    } catch (error) {
      console.log(error);
      setUserData((prev) => ({ ...prev, loading: false }));
      toast.error("Failed to fetch users", {
        style: { backgroundColor: "#EF4444", color: "#f8fafc" },
      });
    }
  };

  const filteredUsers = useMemo(() => {
    let result = [...userData.userList];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((user) => {
        if (filterField === "all") {
          return (
            user.first_name.toLowerCase().includes(term) ||
            user.last_name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
          );
        } else {
          return String(user[filterField]).toLowerCase().includes(term);
        }
      });
    }

    if (sortOrder !== "none") {
      result.sort((a, b) => {
        const fieldA = a[sortOrder.field];
        const fieldB = b[sortOrder.field];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortOrder.direction === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }
        return sortOrder.direction === "asc"
          ? fieldA - fieldB
          : fieldB - fieldA;
      });
    }

    return result;
  }, [userData.userList, searchTerm, filterField, sortOrder]);

  const handlePageChange = (page) => {
    if (
      page !== userData.current_page &&
      page > 0 &&
      page <= userData.total_pages
    ) {
      setUserData((prev) => ({ ...prev, current_page: page }));
    }
  };

  const handleDelete = async (id) => {
    try {
      setUserData((prev) => ({ ...prev, loading: true }));
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUserData((prev) => ({
        ...prev,
        loading: false,
        userList: prev.userList.filter((user) => user.id !== id),
      }));
      toast.success("User deleted successfully", {
        style: { backgroundColor: "#34D399", color: "#f8fafc" },
      });
    } catch (error) {
      console.log(error);
      setUserData((prev) => ({ ...prev, loading: false }));
      toast.error("Failed to delete user", {
        style: { backgroundColor: "#EF4444", color: "#f8fafc" },
      });
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      setUserData((prev) => ({ ...prev, loading: true }));
      const { data } = await axios.put(
        `https://reqres.in/api/users/${id}`,
        values
      );
      setUserData((prev) => ({
        ...prev,
        loading: false,
        userList: prev.userList.map((user) =>
          user.id === id ? { ...user, ...values } : user
        ),
      }));
      toast.success("User updated successfully", {
        style: { backgroundColor: "#34D399", color: "#f8fafc" },
      });
      return true;
    } catch (error) {
      console.log(error);
      setUserData((prev) => ({ ...prev, loading: false }));
      toast.error("Failed to update user", {
        style: { backgroundColor: "#EF4444", color: "#f8fafc" },
      });
      return false;
    }
  };

  const editForm = useForm({
    resolver: zodResolver(formSchema),
  });

  const [editingUser, setEditingUser] = useState(null);

  const openEditDialog = (user) => {
    setEditingUser(user);
    editForm.reset({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterField("all");
    setSortOrder("none");
  };

  useEffect(() => {
    fetchData();
  }, [userData.current_page]);

  return (
    <div className="py-5 md:py-10 px-4 sm:px-6">
      {userData.loading ? (
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin size-10" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Users List
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8 px-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>

            <div className="flex gap-2">
              <Select value={filterField} onValueChange={setFilterField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="first_name">First Name</SelectItem>
                  <SelectItem value="last_name">Last Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={
                  sortOrder === "none"
                    ? "none"
                    : `${sortOrder.field}-${sortOrder.direction}`
                }
                onValueChange={(value) => {
                  if (value === "none") {
                    setSortOrder("none");
                  } else {
                    const [field, direction] = value.split("-");
                    setSortOrder({ field, direction });
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sorting</SelectItem>
                  <SelectItem value="first_name-asc">
                    First Name (A-Z)
                  </SelectItem>
                  <SelectItem value="first_name-desc">
                    First Name (Z-A)
                  </SelectItem>
                  <SelectItem value="last_name-asc">Last Name (A-Z)</SelectItem>
                  <SelectItem value="last_name-desc">
                    Last Name (Z-A)
                  </SelectItem>
                  <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                  <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm ||
                filterField !== "all" ||
                sortOrder !== "none") && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <div className="px-4 mb-4 text-sm text-gray-600">
            Showing {filteredUsers.length} of {userData.userList.length} users
          </div>

          <div className="grid grid-cols-1 gap-4 px-10 md:grid-cols-3 md:px-36 md:gap-10">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col items-center rounded-xl md:rounded-2xl shadow-md md:shadow-xl"
                >
                  <div className="w-full h-32 md:h-42 flex items-center justify-center rounded-t-xl md:rounded-t-2xl rounded-bl-xl md:rounded-bl-3xl bg-blue-600">
                    <div className="border-2 md:border-3 border-white p-0.5 md:p-1 rounded-full">
                      <img
                        src={user.avatar}
                        alt={user.first_name}
                        className="rounded-full size-20 md:size-28"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-600 w-full flex flex-col items-center rounded-b-xl md:rounded-b-2xl">
                    <div className="bg-white p-3 md:p-4 w-full rounded-b-xl md:rounded-b-2xl rounded-tr-xl md:rounded-tr-3xl flex flex-col items-center">
                      <p className="text-base md:text-lg font-bold text-center">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 text-center">
                        {user.email}
                      </p>
                      <div className="mt-3 md:mt-5 mb-1 md:mb-2 flex flex-wrap justify-center gap-1 md:gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="bg-green-500 hover:bg-green-600 cursor-pointer h-8 md:h-9 px-2 md:px-4 text-xs md:text-sm"
                              onClick={() => openEditDialog(user)}
                            >
                              <Pencil className="size-3 md:size-4 mr-1 md:mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            <Form {...editForm}>
                              <form
                                onSubmit={editForm.handleSubmit((values) =>
                                  handleUpdate(editingUser.id, values)
                                )}
                                className="space-y-4"
                              >
                                <FormField
                                  control={editForm.control}
                                  name="first_name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="First Name"
                                          autoFocus={true}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={editForm.control}
                                  name="last_name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Last Name"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={editForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} placeholder="Email" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full">
                                  Save Changes
                                </Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="bg-red-500 hover:bg-red-600 cursor-pointer h-8 md:h-9 px-2 md:px-4 text-xs md:text-sm">
                              <Trash2 className="size-3 md:size-4 mr-1 md:mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this user?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 cursor-pointer"
                                onClick={() => handleDelete(user.id)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6 md:mt-10 px-2">
            <nav className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={() => handlePageChange(userData.current_page - 1)}
                disabled={userData.current_page === 1}
                variant="outline"
                className="h-8 md:h-9 px-2 md:px-4 text-xs md:text-sm cursor-pointer"
              >
                Prev
              </Button>

              <div className="hidden sm:flex items-center gap-1 md:gap-2">
                {Array.from(
                  { length: userData.total_pages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={
                      page === userData.current_page ? "default" : "outline"
                    }
                    className="h-8 md:h-9 w-8 md:w-10 p-0 text-xs md:text-sm cursor-pointer"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <div className="flex sm:hidden items-center">
                <Button
                  variant="default"
                  className="h-8 w-10 p-0 text-xs cursor-pointer"
                >
                  {userData.current_page}
                </Button>
                <span className="mx-1 text-sm">/</span>
                <span className="text-sm">{userData.total_pages}</span>
              </div>

              <Button
                onClick={() => handlePageChange(userData.current_page + 1)}
                disabled={userData.current_page === userData.total_pages}
                variant="outline"
                className="h-8 md:h-9 px-2 md:px-4 text-xs md:text-sm cursor-pointer"
              >
                Next
              </Button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
