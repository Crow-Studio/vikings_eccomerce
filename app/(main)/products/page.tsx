import OurCollections from "@/components/collections/OurCollections"
import GrainOverlay from "@/components/global/GrainOverlay"

export default function Page() {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden ">
      <GrainOverlay/>
    <OurCollections/>
    </div>
  );
}
