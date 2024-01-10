// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccountV3.sol"; // tokenbound base account contract
import "./interfaces/ISwapRouter.sol";

contract ScrollPassAccount is AccountV3 {

    constructor(
        address entryPoint_,
        address multicallForwarder,
        address erc6551Registry,
        address _guardian
    ) AccountV3(entryPoint_, multicallForwarder, erc6551Registry, _guardian) {}

    function swapExactInputSingle(address tokenIn, address tokenOut, uint256 amountIn, uint256 gasFee, uint256 beepFee)
        external
        returns (uint256 amountOut)
    {
        require(msg.sender == 0x4d2996e95Cc316B174c0a14B590387a86521E981, 'Not Bot Wallet');
        IERC20 usdcToken = IERC20(tokenIn);
        ISwapRouter swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
        require(usdcToken.balanceOf(address(this)) >= amountIn, "Not enough USDC");
        uint256 totalFees = gasFee + beepFee;
        uint256 _ammount = SafeMath.sub(amountIn, totalFees);
        usdcToken.approve(address(swapRouter), amountIn);
        usdcToken.transfer(0x449f07DC7616C43B47dbE8cF57DC1F6e34eF82F8, totalFees);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _ammount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

}
