import { Worksheet } from '../F1040Attachment'

export default class ResidentialCleanEnergyCreditLimitWorksheet extends Worksheet {
  /**
Residential Clean Energy Credit Limit Worksheet—Line 14
1. 	  	Enter the amount from Form 1040, 1040-SR, or 1040-NR, line 18 	1. 	_____
2. 	  	Enter the total of the following credit(s)/adjustment(s) if you are taking the credit(s)/adjustment(s) on your 2022 income tax return: 	  	 
  	  	+ Negative Form 8978 Adjustment, Schedule 3 (Form 1040), line 6l 	  	_____
  	  	+ Foreign Tax Credit, Schedule 3 (Form 1040), line 1 	  	_____
  	  	+ Credit for Child and Dependent Care Expenses, Schedule 3 (Form 1040), line 2 	  	_____
  	  	+ Credit for the Elderly or the Disabled, Schedule R (Form 1040), line 22 	  	_____
  	  	+ Nonrefundable Education Credits, Schedule 3 (Form 1040), line 3 	  	_____
  	  	+ Retirement Savings Contributions Credit, Schedule 3 (Form 1040), line 4 	  	_____
  	  	+ Energy efficient home improvement credit, Form 5695, line 30* 	  	_____
  	  	+ Alternative Motor Vehicle Credit, Personal use part, Form 8910, line 15 	  	_____
  	  	+ Qualified Plug-in Electric Drive Motor Vehicle Credit, Personal use part, Form 8936, line 23 	  	_____
  	  	+ Child tax credit and credit for other dependents, Form 1040, 1040-SR, or 1040-NR, line 19** 	  	_____
  	  	+ Mortgage Interest Credit, Form 8396, line 9 	  	_____
  	  	+ Adoption Credit, Form 8839, line 16 	  	_____
  	  	+ Carryforward of the District of Columbia First-Time Homebuyer Credit, Form 8859, line 3 	  	_____
  	  	Note. Enter the total of the preceding credit(s)/adjustment(s), only if allowed and taken on your 2022 income tax return. Not all credits/adjustments are available for all years nor for all filers. See the instructions for your 2022 income tax return. 	2. 	 
3. 	  	Subtract line 2 from line 1. Also enter this amount on Form 5695, line 14. If zero or less, enter ‐0‐ on Form 5695, lines 14 and 15 	3. 	 
  	  	  	  	 
* If applicable.
** Include the amount from Schedule 8812 (Form 1040), Credit Limit Worksheet B, line 14, instead of the amount from Form 1040, 1040-SR, or 1040-NR, line 19, if the instructions for Schedule 8812 (Form 1040) direct you to complete Credit Limit Worksheet B.
   */
  isNeeded = (): boolean => {
    const schedule3 = this.f1040.schedule3
    const f5695 = this.f1040.f5695

    const s3Needed = schedule3.isNeeded() // && (schedule3.l5() ?? 0) > 0

    return schedule3.isNeeded() // || f5695Condition
  }

  // TODO - Required by 6251,
  // Might be refigured for AMT
  l10 = (): number | undefined => undefined

  // TODO - Required by 6251,
  l13 = (): number | undefined => undefined

  // TODO - Required by 6251,
  l14 = (): number | undefined => undefined

  // TODO - Required by 6251,
  l21 = (): number | undefined => undefined
}
