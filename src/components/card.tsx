import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import './card.css'

function Card() {
    const cardRotationMax = 15;
    const cardScale = 1.07;
    const sheenSize = 500;

    const xPos = useSpring(0, { bounce: 0 });
    const yPos = useSpring(0, { bounce: 0 });
    const scale = useSpring(1, { bounce: 0 });
    const mouseX = useSpring(0, { bounce: 0 });
    const mouseY = useSpring(0, { bounce: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const rotateX = useTransform(yPos, [-0.5, 0.5], [`-${cardRotationMax + 5}deg`, `${cardRotationMax + 5}deg`]);
    const rotateY = useTransform(xPos, [-0.5, 0.5], [`-${cardRotationMax}deg`, `${cardRotationMax}deg`]);

    const sheenX = useTransform(mouseX, (value) => value - sheenSize / 2);
    const sheenY = useTransform(mouseY, (value) => value - sheenSize / 2);

    function getMousePosition(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { width, height, left, top } = event.currentTarget.getBoundingClientRect();

        const currentMouseX = event.clientX - left;
        const currentMouseY = event.clientY - top;

        return {
            currentMouseX,
            currentMouseY,
            containerWidth: width,
            containerHeight: height
        }
    }

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const { currentMouseX, currentMouseY, containerWidth, containerHeight } = getMousePosition(event);

        xPos.set((currentMouseX / containerWidth) - 0.5);
        yPos.set((currentMouseY / containerHeight) - 0.5);

        mouseX.set(currentMouseX);
        mouseY.set(currentMouseY);

        console.log(xPos.get(), yPos.get());

    }

    function handleMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        scale.set(cardScale);
        setIsHovering(true);
    }

    function handleMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        scale.set(1);
        xPos.set(0);
        yPos.set(0);
        setIsHovering(false);
    }

    return (
        <div style={{ position: 'relative' }}>
            <motion.div className='card'
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
                rotateX,
                rotateY,
                scale,
                overflow: 'hidden', // Add this line to contain the sheen within the card
                borderRadius: '1%',
            }}
            >
            <img src="/varina.png" alt="Varina"></img>

            <motion.div style={{
                position: 'absolute',
                zIndex: 10,
                opacity: isHovering ? 0.3 : 0,
                borderRadius: '50%',
                filter: 'blur(10px)',
                background: 'radial-gradient(white, #3984ff00 80%)',
                left: sheenX,
                top: sheenY,
                height: sheenSize,
                width: sheenSize,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
            }} />
            </motion.div>
        </div>

    )
}

export default Card
