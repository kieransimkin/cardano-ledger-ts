import { Cbor, CborArray, CborSimple, CborString, CborUInt, ToCbor } from "@harmoniclabs/cbor";
import { CanBeHash28, Hash28, canBeHash28 } from "../../hashes";
import { ITxWithdrawals, TxWithdrawals, isITxWithdrawals } from "../../ledger";
import { IGovAction } from "./IGovAction";
import { GovActionType } from "./GovActionType";
import { roDescr } from "../../utils/roDescr";
import { isObject } from "@harmoniclabs/obj-utils";

export interface IGovActionTreasuryWithdrawals {
    withdrawals: ITxWithdrawals | TxWithdrawals,
    policyHash?: CanBeHash28 | undefined
}

export function isIGovActionTreasuryWithdrawals( stuff: any ): stuff is IGovActionTreasuryWithdrawals
{
    return isObject( stuff ) && (
        ( stuff.withdrawals instanceof TxWithdrawals || isITxWithdrawals( stuff.withdrawals ) ) &&
        ( stuff.policyHash === undefined || canBeHash28( stuff.policyHash ) )
    );
}

export class GovActionTreasuryWithdrawals
    implements IGovAction, IGovActionTreasuryWithdrawals, ToCbor
{
    readonly govActionType: GovActionType.TreasuryWithdrawals;
    readonly withdrawals: TxWithdrawals;
    readonly policyHash: Hash28 | undefined;

    constructor({ withdrawals, policyHash }: IGovActionTreasuryWithdrawals)
    {
        Object.defineProperties(
            this, {
                govActionType: { value: GovActionType.TreasuryWithdrawals, ...roDescr },
                withdrawals: {
                    value: withdrawals instanceof TxWithdrawals ? withdrawals : new TxWithdrawals( withdrawals ),
                    ...roDescr
                },
                policyHash: {
                    value: canBeHash28( policyHash ) ? new Hash28( policyHash ) : undefined,
                    ...roDescr
                }
            }
        );
    }

    toCbor(): CborString
    {
        return Cbor.encode( this.toCborObj() );
    }
    toCborObj(): CborArray
    {
        return new CborArray([
            new CborUInt( this.govActionType ),
            this.withdrawals.toCborObj(),
            this.policyHash?.toCborObj() ?? new CborSimple( null )
        ]);
    }
}