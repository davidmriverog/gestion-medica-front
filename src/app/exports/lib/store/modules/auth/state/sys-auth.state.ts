import { AccountingPeriodModel } from '../../../../../../project/models/ac/accounting-period.model';
import { SysUserConnectionModel } from '../../../../../../project/models/sys/sys-user-connection.model';
import { ClientInfoModel } from '../../../../../../project/models/config/client-info.model';

export interface IAuthState {
  isLoading: boolean;
  isFailed: boolean;
  errorMessage: string;
  userId: string;
  username: string;
  email: string;
  accessToken: string;
  role: string;
  permissions: Array<string>;
  userConnection: SysUserConnectionModel;
  period?: AccountingPeriodModel;
  clientInfo?: ClientInfoModel;
  active: boolean;
}