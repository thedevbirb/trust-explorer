import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

interface Props {
  targetValue: number;
  animationDuration: number;
}

export default function NumberAnimation(props: Props) {
  const { targetValue, animationDuration } = props;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const increment = (targetValue / animationDuration) * progress;

      if (progress < animationDuration) {
        setCount(Math.min(increment, targetValue));
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      setCount(0);
    };
  }, [targetValue, animationDuration]);

  return (
    <Box color="white" fontSize="2xl" fontWeight="bold">
      {Math.round(count)} reviews by users
    </Box>
  );
}
