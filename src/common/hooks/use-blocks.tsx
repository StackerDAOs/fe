// Hook (use-blocks.tsx)
import { useEffect, useState } from 'react';

import { useNetwork } from '@micro-stacks/react';
import { fetchBlocks } from 'micro-stacks/api';

export function useBlocks() {
  // TODO: check if slug is present and return error if not
  // TODO: check if oranization exists before checking balance
  const [state, setState] = useState<any>({
    blocks: [],
    currentBlockHeight: 0,
  });
  const { network } = useNetwork();

  useEffect(() => {
    async function fetch() {
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
        console.log(e);
      } finally {
        console.log('finally');
      }
    }
    fetch();
  }, []);

  return { blocks: state.blocks, currentBlockHeight: state.currentBlockHeight };
}
