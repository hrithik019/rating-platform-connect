
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/context/DataContext";
import { validateName, validateEmail, validateAddress } from "@/utils/validation";
import { Store, UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoreFormProps {
  onSuccess?: () => void;
  existingStore?: Store;
}

const StoreForm: React.FC<StoreFormProps> = ({ onSuccess, existingStore }) => {
  const { addStore } = useData();
  const { user } = useAuth();
  const { users } = useData();
  
  // Filter users to get only store owners
  const storeOwners = users.filter(u => u.role === UserRole.STORE_OWNER);
  
  const { register, handleSubmit, setError, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: existingStore?.name || "",
      email: existingStore?.email || "",
      address: existingStore?.address || "",
      ownerId: existingStore?.ownerId || "",
    },
  });

  const onSubmit = async (data: { 
    name: string;
    email: string;
    address: string;
    ownerId: string;
  }) => {
    try {
      addStore({
        name: data.name,
        email: data.email,
        address: data.address,
        ownerId: data.ownerId,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("root", {
        message: "Failed to add store. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingStore ? "Edit Store" : "Add New Store"}</CardTitle>
        <CardDescription>
          {existingStore 
            ? "Update the store's information" 
            : "Enter the details for the new store"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input 
              id="name" 
              placeholder="Store Name" 
              {...register("name", { 
                required: "Store name is required",
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
              placeholder="store@example.com" 
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
              placeholder="Enter store address" 
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
            <Label htmlFor="owner">Store Owner</Label>
            <Select 
              onValueChange={(value) => setValue("ownerId", value)}
              defaultValue={watch("ownerId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select store owner" />
              </SelectTrigger>
              <SelectContent>
                {storeOwners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownerId && (
              <p className="text-sm text-destructive">{errors.ownerId.message}</p>
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
            {isSubmitting ? "Saving..." : existingStore ? "Update Store" : "Add Store"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StoreForm;
