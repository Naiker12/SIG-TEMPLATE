
'use client';

import { cn } from "@/lib/utils";

const AtomLoader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("h-20 w-20 relative", className)}
        {...props}
    >
        <div className="absolute h-full w-full animate-[spin_2s_linear_infinite]">
            <div className="h-1/2 w-1/2 border-4 border-primary rounded-[50%] border-b-transparent border-l-transparent absolute top-0 left-0"></div>
        </div>
        <div className="absolute h-full w-full animate-[spin_3s_linear_infinite]">
            <div className="h-1/2 w-1/2 border-4 border-secondary rounded-[50%] border-r-transparent border-b-transparent absolute top-0 right-0"></div>
        </div>
        <div className="absolute h-full w-full animate-[spin_4s_linear_infinite]">
            <div className="h-1/2 w-1/2 border-4 border-destructive rounded-[50%] border-t-transparent border-r-transparent absolute bottom-0 right-0"></div>
        </div>
    </div>
);

export { AtomLoader };
