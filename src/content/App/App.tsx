import { TooltipProvider } from 'core/lib/ui/molecules/Tooltip/Tooltip';
import { AppShell } from 'content/features/AppShell/AppShell';

export const App = () => {
  return (
    <TooltipProvider>
      <AppShell />
    </TooltipProvider>
  );
};
