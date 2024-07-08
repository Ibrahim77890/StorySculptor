"use server"

import { connectToDatabase } from "@/supabaseMiddleware";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";


interface CreateUserParams {
    clerk_id: string;
    email: string;
    username: string;
    photo: string;
    first_name?: string;
    last_name?: string;
    plan_id?: number;
    credit_balance?: number;
}

interface UpdateUserParams {
    email?: string;
    username?: string;
    photo?: string;
    first_name?: string;
    last_name?: string;
    plan_id?: number;
    credit_balance?: number;
}

// Create
export async function createUser(user: CreateUserParams) {
    try {
        const supabase = await connectToDatabase();

        const { data, error } = await supabase.from('users_ss').insert([user]).single();
        if (error) throw error;
        if (!data) throw new Error("User Insertion failed");

        const { data: newUser, error: newUserError } = await getUserById(user.clerk_id);
        if (newUserError) throw error;
        if (!newUser) throw new Error("User Insertion failed");

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

// Read
export async function getUserById(userId: string) {
    try {
        const supabase = await connectToDatabase();
        const { data:newUser, error } = await supabase.from('users_ss').select('*').eq('clerk_id', userId).single();
        if (error) throw error;
        if (!newUser) throw new Error("User Extraction failed");
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

// Update
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        const supabase = await connectToDatabase();
        const { data, error } = await supabase.from('users_ss').update(user).eq('clerkId', clerkId).single();
        if (error) throw error;
        if (!data) throw new Error("User update failed");

        const { data: newUser, error: newUserError } = await getUserById(clerkId);
        if (newUserError) throw error;
        if (!newUser) throw new Error("User Insertion failed");

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

// Delete
export async function deleteUser(clerkId: string) {
    try {
        const supabase = await connectToDatabase();
        // First, find the user to delete
        const { data: userToDelete, error: findError } = await supabase.from('users').select('id').eq('clerk_id', clerkId).single();

        if (findError) throw findError;
        if (!userToDelete) throw new Error("User not found");

        // Delete the user
        const { data: deletedUser, error: deleteError } = await supabase.from('users').delete().eq('id', userToDelete.id).single();

        if (deleteError) throw deleteError;

        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error);
    }
}

// Update credits
export async function updateCredits(userId: string, creditFee: number) {
    try {
        const supabase = await connectToDatabase();
        const { data, error } = await supabase
            .from('users_ss')
            .update({ creditBalance: supabase.rpc('credit_balance + ?', [creditFee]) })
            .eq('id', userId)
            .single();

        if (error) throw error;
        if (!data) throw new Error("User credits update failed");

        const {data:updatedUserCredits, error:newError} = await supabase
        .from('users_ss')
        .select('credit_balance')
        .eq('id', userId)
        .single();

    if (newError) throw newError;
    if (!updatedUserCredits) throw new Error("Failed to fetch updated user credits");

        return JSON.parse(JSON.stringify(updatedUserCredits));
    } catch (error) {
        handleError(error);
    }
}