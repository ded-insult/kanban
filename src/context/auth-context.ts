"use client";

import React from "react";
import { User } from "@/domain/user";

export const AuthContext = React.createContext<User | null>(null);
