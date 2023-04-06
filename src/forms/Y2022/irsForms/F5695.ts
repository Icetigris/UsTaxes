import F1040Attachment from './F1040Attachment'
import { ResidentialEnergyCredits } from 'ustaxes/core/data'
import { FormTag } from 'ustaxes/core/irsForms/Form'
import { Field } from 'ustaxes/core/pdfFiller'
import F1040 from './F1040'
import { sumFields } from 'ustaxes/core/irsForms/util'

const blankResidentialEnergyCredits = {
  solarElectric: 0,
  solarWaterHeating: 0,
  smallWindEnergy: 0,
  geothermalHeatPump: 0,
  biomassFuel: 0,
  fuelCell: 0,
  fuelCellKilowattCapacity: 0,
  carryForwardCredits: 0
}

export default class F5695 extends F1040Attachment {
  tag: FormTag = 'f5695'
  residentialEnergyCredits: ResidentialEnergyCredits
  sequenceIndex = 999
  constructor(f1040: F1040) {
    super(f1040)
    this.residentialEnergyCredits = {
      ...blankResidentialEnergyCredits,
      ...(f1040.info.residentialEnergyCredits ?? {})
    }
  }
  // Part I
  l1 = (): number | number =>
    Number(this.residentialEnergyCredits.solarElectric) // Qualified solar electric property costs
  l2 = (): number | number =>
    Number(this.residentialEnergyCredits.solarWaterHeating) // Qualified solar water heating property costs
  l3 = (): number | number =>
    Number(this.residentialEnergyCredits.smallWindEnergy) // Qualified small wind energy property costs
  l4 = (): number | number =>
    Number(this.residentialEnergyCredits.geothermalHeatPump) // Qualified geothermal heat pump property costs
  l5 = (): number | number => Number(this.residentialEnergyCredits.biomassFuel) // Qualified biomass fuel property costs

  l6a = (): number =>
    sumFields([this.l1(), this.l2(), this.l3(), this.l4(), this.l5()])

  l6b = (): number => this.l6a() * 0.3

  //TODO: 7a Qualified fuel cell property. Was qualified fuel cell property installed on, or in connection with, your main home located in the United States? (See instructions.)
  l7a = (): boolean => false

  //TODO: 7b Print the complete address of the main home where you installed the fuel cell property.
  l7b = (): string | undefined => undefined

  l8 = (): number => Number(this.residentialEnergyCredits.fuelCell) // Qualified fuel cell property costs
  l9 = (): number => this.l8() * 0.3 // Multiply line 8 by 30% (0.30)

  l10preMultiplier = (): number | number =>
    Number(this.residentialEnergyCredits.fuelCellKilowattCapacity) // Kilowatt capacity of property on line 8 above ___ x $1,000 = l10
  l10 = (): number => this.l10preMultiplier() * 1000 // Kilowatt capacity of property on line 8 above ___ x $1,000 = l10

  l11 = (): number => Math.max(this.l9(), this.l10())
  l12 = (): number => Number(this.residentialEnergyCredits.carryForwardCredits) // Credit carryforward from 2021. Enter the amount, if any, from your 2021 Form 5695, line 16
  l13 = (): number => this.l6b() + this.l11() + this.l12()

  l14 = (): number | undefined => undefined // TODO: Limitation based on tax liability. Enter the amount from the Residential Clean Energy Credit Limit Worksheet (see instructions)
  l15 = (): number => this.l13() //Math.min(this.l13(), this.l14())

  l16 = (): number => 0 // Credit carryforward to 2023. If line 15 is less than line 13, subtract line 15 from line 13
  //if (this.l15() < this.l13()) {
  //  l16 = this.l13() - this.l15()
  //}
  l17a = (): number | undefined => undefined //Were the qualified energy efficiency improvements or residential energy property costs for your main home located in the United States? (see instructions)

  l30 = (): number | undefined => undefined

  fields = (): Field[] => [
    this.f1040.namesString(),
    this.f1040.info.taxPayer.primaryPerson.ssid,
    this.l1(),
    this.l2(),
    this.l3(),
    this.l4(),
    this.l5(),
    this.l6a(),
    this.l6b(),
    this.l7a(),
    this.l7b(),
    this.l8(),
    this.l9(),
    this.l10(),
    this.l11(),
    this.l12(),
    this.l13(),
    this.l14(),
    this.l15(),
    this.l16(),
    this.l17a(),
    /*    
    this.l17b(),
    this.l17c(),
    this.l18(),
    this.l19a(),
    this.l19b(),
    this.l19c(),
    this.l19d(),
    this.l19e(),
    this.l19f(),
    this.l19g(),
    this.l19h(),
    this.l20(),
    this.l21(),
    this.l22a(),
    this.l22b(),
    this.l22c(),
    this.l23(),
    this.l24(),
    this.l25(),
    this.l26(),
    this.l27(),
    this.l28(),
    this.l29(),
*/
    this.l30()
  ]
}
