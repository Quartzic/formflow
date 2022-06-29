import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import StyledButton from "./StyledButton";

describe('StyledButton', () => {
    it('displays child contents', async () => {
        render(<StyledButton>Destroy universe</StyledButton>)
        await screen.findByRole('button');
        expect(screen.getByRole('button')).toHaveTextContent('Destroy universe')
    })

    it('is enabled by default', async () => {
        render(<StyledButton/>)
        await screen.findByRole('button');
        expect(screen.getByRole('button')).toBeEnabled();
    })

    it('calls onClick prop when clicked', async () => {
        const onClick = jest.fn();
        render(<StyledButton onClick={onClick}/>)
        await screen.findByRole('button');
        screen.getByRole('button').click();
        expect(onClick).toHaveBeenCalled();
    });

    it('is colored red with danger role', async () => {
        render(<StyledButton role="danger"/>)
        await screen.findByRole('button');
        expect(screen.getByRole('button')).toHaveClass('bg-red-500');
    });
});