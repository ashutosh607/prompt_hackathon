import { supabase } from "./lib/supabase";
import { Button } from "./components/ui/button";

function App() {
  console.log("Supabase initialized:", supabase);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button>
        Get Started
      </Button>
    </div>
  );
}

export default App;