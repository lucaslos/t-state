import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useCreateStore } from '../src/useCreateStore';
import Store from '../src';

describe('useCreateStore', () => {
  type TestState = {
    numOfClicks: number;
    obj: {
      test: boolean;
    };
  };

  test('basic usage', () => {
    const Component = () => {
      const testState = useCreateStore<TestState>({
        name: 'teste',
        state: {
          numOfClicks: 0,
          obj: {
            test: true,
          },
        },
      });

      const [numOfClicks, setNumOfClicks] = testState.useKey('numOfClicks');

      return (
        <button type="button" onClick={() => setNumOfClicks(numOfClicks + 1)}>
          Num of clicks: {numOfClicks}
        </button>
      );
    };

    const { getByRole } = render(<Component />);

    const button = getByRole('button');
    expect(button).toHaveTextContent('Num of clicks: 0');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Num of clicks: 1');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Num of clicks: 2');
  });

  test('basic usag with lazy config', () => {
    const Component = () => {
      const testState = useCreateStore<TestState>(() => ({
        name: 'teste',
        state: {
          numOfClicks: 0,
          obj: {
            test: true,
          },
        },
      }));

      const [numOfClicks, setNumOfClicks] = testState.useKey('numOfClicks');

      return (
        <button type="button" onClick={() => setNumOfClicks(numOfClicks + 1)}>
          Num of clicks: {numOfClicks}
        </button>
      );
    };

    const { getByRole } = render(<Component />);

    const button = getByRole('button');
    expect(button).toHaveTextContent('Num of clicks: 0');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Num of clicks: 1');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Num of clicks: 2');
  });

  test('only render the correct components', () =>
    new Promise<void>((done) => {
      const consoleError = jest.spyOn(global.console, 'error');

      const onRenderChild = jest.fn();
      const onRenderParent = jest.fn();

      const Child = ({ testState }: { testState: Store<TestState> }) => {
        onRenderChild();

        const [numOfClicks] = testState.useKey('numOfClicks');

        return <div data-testid="show-state">Num of clicks: {numOfClicks}</div>;
      };

      const Component = () => {
        const testState = useCreateStore<TestState>({
          name: 'teste',
          state: {
            numOfClicks: 0,
            obj: {
              test: true,
            },
          },
        });

        onRenderParent();

        return (
          <button
            type="button"
            onClick={() =>
              testState.setKey(
                'numOfClicks',
                testState.getState().numOfClicks + 1,
              )
            }
          >
            <Child testState={testState} />
          </button>
        );
      };

      const { getByTestId, getByRole, unmount } = render(<Component />);

      const button = getByRole('button');
      const element = getByTestId('show-state');
      expect(element).toHaveTextContent('Num of clicks: 0');

      fireEvent.click(button);
      expect(element).toHaveTextContent('Num of clicks: 1');

      fireEvent.click(button);
      expect(element).toHaveTextContent('Num of clicks: 2');

      unmount();

      expect(consoleError).not.toHaveBeenCalled();

      expect(onRenderChild).toHaveBeenCalledTimes(3);
      expect(onRenderParent).toHaveBeenCalledTimes(1);
      done();
    }));

  test('when a component unmounts, the store removes its reference', () => {
    const Component = () => {
      const testState = useCreateStore<TestState>({
        name: 'teste',
        state: {
          numOfClicks: 0,
          obj: {
            test: true,
          },
        },
      });

      const [numOfClicks, setNumOfClicks] = testState.useKey('numOfClicks');

      return (
        <button type="button" onClick={() => setNumOfClicks(numOfClicks + 1)}>
          Num of clicks: {numOfClicks}
        </button>
      );
    };

    const { getByRole } = render(<Component />);

    const button = getByRole('button');
    expect(button).toHaveTextContent('Num of clicks: 0');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Num of clicks: 1');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Num of clicks: 2');
  });
});
