import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import cameraIcon from "../../public/camera.svg"

import { api } from "~/utils/api";
import { file2Base64 } from "~/utils/file";
import Image from "next/image";

export default function Home() {
  const solveEquation = api.math.solveEquation.useMutation();

  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      file2Base64(file).then(
        (base64) => {
          const explanation = solveEquation.mutateAsync({ base64Image: base64 });
          console.log(explanation)
        }).catch((error) => console.error("Error:", error))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Math Made Easy</CardTitle>
          <p className="text-sm text-center text-zinc-400">
            Take a photo of your math problem and get step-by-step solutions instantly
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-48 border-2 border-dashed border-zinc-700 rounded-lg overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Captured math problem" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  className="w-12 h-12 text-white"
                  priority
                  src={cameraIcon}
                  alt="Take a picture of a math problem"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleCapture}
              className="hidden"
              id="captureInput"
            />
            <label htmlFor="captureInput" className="cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-md">
              <Button className="w-full bg-transparent text-white pointer-events-none">
                Take Picture
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}
