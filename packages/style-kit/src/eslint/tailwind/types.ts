export interface TailwindPluginSettings {
  tailwindcss?: {
    /**
     * Functions that will be treated as Tailwind CSS class name generators
     */
    callees?: string[];
    /**
     * Regular expression to match class-related attributes
     */
    classRegex?: string;
    /**
     * Path to the Tailwind config file
     */
    config?: string;
    /**
     * CSS files glob patterns to include/exclude
     */
    cssFiles?: string[];
    /**
     * How often to refresh CSS files (in milliseconds)
     */
    cssFilesRefreshRate?: number;
    /**
     * Whether to remove duplicate class names
     */
    removeDuplicates?: boolean;
    /**
     * Whether to skip the class attribute
     */
    skipClassAttribute?: boolean;
    /**
     * List of template literal tags to process
     */
    tags?: string[];
    /**
     * List of class names to whitelist
     */
    whitelist?: string[];
  };
}
