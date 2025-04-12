
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/context/DataContext";
import { validateName, validateEmail, validatePassword, validateAddress } from "@/utils/validation";
import { User, UserRole } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormProps {
  onSuccess?: () => void;
  existingUser?: User;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess, existingUser }) => {
  const { addUser } = useData();
  
  const { register, handleSubmit, setError, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: existingUser?.name || "",
      email: existingUser?.email || "",
      address: existingUser?.address || "",
      role: existingUser?.role || UserRole.USER,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: { 
    name: string;
    email: string;
    address: string;
    role: UserRole;
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    
    try {
      addUser({
        name: data.name,
        email: data.email,
        address: data.address,
        role: data.role,
      }, data.password);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("root", {
        message: "Failed to add user. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingUser ? "Edit User" : "Add New User"}</CardTitle>
        <CardDescription>
          {existingUser 
            ? "Update the user's information" 
            : "Enter the details for the new user"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Full Name" 
              {...register("name", { 
                required: "Name is required",
                validate: validateName
              })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              placeholder="name@example.com" 
              {...register("email", { 
                required: "Email is required",
                validate: validateEmail
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              placeholder="Enter address" 
              {...register("address", { 
                required: "Address is required",
                validate: validateAddress
              })}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              onValueChange={(value) => setValue("role", value as UserRole)}
              defaultValue={watch("role")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                <SelectItem value={UserRole.USER}>Normal User</SelectItem>
                <SelectItem value={UserRole.STORE_OWNER}>Store Owner</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...register("password", { 
                required: "Password is required",
                validate: validatePassword
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              {...register("confirmPassword", { 
                required: "Please confirm password" 
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : existingUser ? "Update User" : "Add User"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;
