import React from "react";
import { cn } from "../../lib/utils";

const FeatureSection = React.forwardRef(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("w-full py-12 md:py-24 lg:py-32", className)}
    {...props}
  />
));
FeatureSection.displayName = "FeatureSection";

const FeatureSectionContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("container mx-auto px-4 md:px-6 max-w-7xl", className)}
    {...props}
  />
));
FeatureSectionContent.displayName = "FeatureSectionContent";

const FeatureSectionHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center justify-center space-y-4 text-center", className)}
    {...props}
  />
));
FeatureSectionHeader.displayName = "FeatureSectionHeader";

const FeatureSectionTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none",
      className
    )}
    {...props}
  />
));
FeatureSectionTitle.displayName = "FeatureSectionTitle";

const FeatureSectionDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400",
      className
    )}
    {...props}
  />
));
FeatureSectionDescription.displayName = "FeatureSectionDescription";

const FeatureSectionGrid = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12",
      className
    )}
    {...props}
  />
));
FeatureSectionGrid.displayName = "FeatureSectionGrid";

const FeatureCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-lg transition-all duration-300",
      className
    )}
    {...props}
  />
));
FeatureCard.displayName = "FeatureCard";

const FeatureCardIcon = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground",
      className
    )}
    {...props}
  />
));
FeatureCardIcon.displayName = "FeatureCardIcon";

const FeatureCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("mb-2 text-xl font-bold", className)}
    {...props}
  />
));
FeatureCardTitle.displayName = "FeatureCardTitle";

const FeatureCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
FeatureCardDescription.displayName = "FeatureCardDescription";

export {
  FeatureSection,
  FeatureSectionContent,
  FeatureSectionHeader,
  FeatureSectionTitle,
  FeatureSectionDescription,
  FeatureSectionGrid,
  FeatureCard,
  FeatureCardIcon,
  FeatureCardTitle,
  FeatureCardDescription,
};