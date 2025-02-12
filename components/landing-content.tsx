"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name: "Emily Carter",
        avatar: "EC",
        title: "Creative Director",
        description: "The AI-generated images are breathtaking and saved hours of work. It's like having a whole design team at your fingertips!",
    },
    {
        name: "Michael Johnson",
        avatar: "MJ",
        title: "Software Developer",
        description: "I was blown away by the accurate and efficient code generation. It’s perfect for quick prototyping and complex logic alike!",
    },
    {
        name: "Rachel Williams",
        avatar: "RW",
        title: "Music Producer",
        description: "Creating music with this AI is an absolute joy. The melodies are fresh and innovative – it’s like collaborating with a genius musician!",
    },
    {
        name: "James Brown",
        avatar: "JB",
        title: "Content Creator",
        description: "The video generation tool is a lifesaver! I can now produce professional-quality videos in minutes for my social media campaigns.",
    },
    
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">Testimonials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg ">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">{item.description}</CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandingContent;