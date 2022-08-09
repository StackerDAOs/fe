// Hook (use-blocks.tsx)
import React from 'react';
import { useNetwork } from '@micro-stacks/react';
import { fetchBlocks } from 'micro-stacks/api';

export function useBlocks() {
  const [state, setState] = React.useState<any>({
    blocks: [],
    currentBlockHeight: 0,
  });
  const { network } = useNetwork();
  const getBlocks = React.useCallback(async () => {
    try {
      const url = network.getCoreApiUrl();
      const limit = 1;
      const offset = 0;
      const blocks = await fetchBlocks({
        url,
        limit,
        offset,
      });
      setState({
        ...state,
        blocks: blocks,
        currentBlockHeight: blocks.total,
      });
    } catch (e: any) {
      console.error({ e });
    }
  }, []);

  React.useEffect(() => {
    getBlocks();
  }, []);

  return { blocks: state.blocks, currentBlockHeight: state.currentBlockHeight };
}
