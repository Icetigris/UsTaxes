import { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector, TaxesState } from 'ustaxes/redux'
import { setResidentialEnergyCredits } from 'ustaxes/redux/actions'
import { usePager } from 'ustaxes/components/pager'
import { LabeledInput, LabeledCheckbox } from 'ustaxes/components/input'
import { ResidentialEnergyCredits } from 'ustaxes/core/data'
import { Patterns } from 'ustaxes/components/Patterns'
import { Grid } from '@material-ui/core'
import { intentionallyFloat } from 'ustaxes/core/util'

interface ResidentialEnergyCreditUserInput {
  solarElectric: string | number
  solarWaterHeating: string | number
  smallWindEnergy: string | number
  geothermalHeatPump: string | number
  biomassFuel: string | number
  fuelCell: string | number
  fuelCellKilowattCapacity: string | number
  carryForwardCredits: string | number
}

const blankUserInput: ResidentialEnergyCreditUserInput = {
  solarElectric: '',
  solarWaterHeating: '',
  smallWindEnergy: '',
  geothermalHeatPump: '',
  biomassFuel: '',
  fuelCell: '',
  fuelCellKilowattCapacity: '',
  carryForwardCredits: ''
}

const toUserInput = (
  f: ResidentialEnergyCredits
): ResidentialEnergyCreditUserInput => ({
  ...blankUserInput,
  solarElectric: f.solarElectric,
  solarWaterHeating: f.solarWaterHeating,
  smallWindEnergy: f.smallWindEnergy,
  geothermalHeatPump: f.geothermalHeatPump,
  biomassFuel: f.biomassFuel,
  fuelCell: f.fuelCell,
  fuelCellKilowattCapacity: f.fuelCellKilowattCapacity,
  carryForwardCredits: f.carryForwardCredits
})

const toResidentialEnergyCredits = (
  f: ResidentialEnergyCreditUserInput
): ResidentialEnergyCredits => {
  return {
    solarElectric: Number(f.solarElectric),
    solarWaterHeating: Number(f.solarWaterHeating),
    smallWindEnergy: f.smallWindEnergy,
    geothermalHeatPump: Number(f.geothermalHeatPump),
    biomassFuel: Number(f.biomassFuel),
    fuelCell: Number(f.fuelCell),
    fuelCellKilowattCapacity: Number(f.fuelCellKilowattCapacity),
    carryForwardCredits: Number(f.carryForwardCredits)
  }
}

export const ResidentialEnergyCreditsInfo = (): ReactElement => {
  const residentialEnergyCredits: ResidentialEnergyCredits | undefined =
    useSelector((state: TaxesState) => {
      return state.information.residentialEnergyCredits
    })

  const defaultValues: ResidentialEnergyCreditUserInput = {
    ...blankUserInput,
    ...(residentialEnergyCredits !== undefined
      ? toUserInput(residentialEnergyCredits)
      : {})
  }

  const { onAdvance, navButtons } = usePager()

  const methods = useForm<ResidentialEnergyCreditUserInput>({ defaultValues })
  const { handleSubmit } = methods

  const dispatch = useDispatch()

  const onSubmit = (form: ResidentialEnergyCreditUserInput): void => {
    dispatch(setResidentialEnergyCredits(toResidentialEnergyCredits(form)))
    onAdvance()
  }

  const form: ReactElement | undefined = (
    <div>
      <p>Residential Clean Energy Credit</p>
      <Grid container spacing={2}>
        <LabeledInput
          label="Qualified solar electric property costs"
          patternConfig={Patterns.currency}
          name="solarElectric"
          required={false}
        />
        <LabeledInput
          label="Qualified solar water heating property costs"
          patternConfig={Patterns.currency}
          name="solarWaterHeating"
          required={false}
        />
        <LabeledInput
          label="Qualified small wind energy property costs"
          patternConfig={Patterns.currency}
          name="smallWindEnergy"
          required={false}
        />
        <LabeledInput
          label="Qualified geothermal heat pump property costs"
          patternConfig={Patterns.currency}
          name="geothermalHeatPump"
          required={false}
        />
        <LabeledInput
          label="Qualified biomass fuel property costs"
          patternConfig={Patterns.currency}
          name="biomassFuel"
          required={false}
        />
      </Grid>
      <p>Energy Efficient Home Improvement Credit</p>
      <Grid container spacing={2}>
        <LabeledCheckbox
          label=" Were the qualified energy efficiency improvements or residential energy property costs for your main home located in the United States?"
          name="isEnergyEfficiencyImprovementDomestic"
        />
      </Grid>
    </div>
  )

  return (
    <form tabIndex={-1} onSubmit={intentionallyFloat(handleSubmit(onSubmit))}>
      <p>
        If you did not make clean energy improvements to your home, you can skip
        this form.
      </p>
      <FormProvider {...methods}>
        <Helmet>
          <title>
            Residential Energy Credits Information | Credits | UsTaxes.org
          </title>
        </Helmet>
        <h2>Residential Energy Credits Information</h2>
        {form}
        {navButtons}
      </FormProvider>
    </form>
  )
}

export default ResidentialEnergyCreditsInfo
