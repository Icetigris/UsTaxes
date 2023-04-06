import F1040Attachment from './F1040Attachment'
import { PersonRole } from 'ustaxes/core/data'
import { sumFields } from 'ustaxes/core/irsForms/util'
import { FormTag } from 'ustaxes/core/irsForms/Form'
import { fica } from '../data/federal'
import { Field } from 'ustaxes/core/pdfFiller'

export default class Schedule3 extends F1040Attachment {
  tag: FormTag = 'f1040s3'
  sequenceIndex = 3

  claimableExcessSSTaxWithholding = (): number => {
    const w2s = this.f1040.validW2s()

    // Excess FICA taxes are calculated per person. If an individual person
    //    has greater than the applicable amount then they are entitled to a refund
    //    of that amount

    let claimableExcessFica = 0
    const primaryFica = w2s
      .filter((w2) => w2.personRole == PersonRole.PRIMARY)
      .map((w2) => w2.ssWithholding)
      .reduce((l, r) => l + r, 0)
    const spouseFica = w2s
      .filter((w2) => w2.personRole == PersonRole.SPOUSE)
      .map((w2) => w2.ssWithholding)
      .reduce((l, r) => l + r, 0)

    if (
      primaryFica > fica.maxSSTax &&
      w2s
        .filter((w2) => w2.personRole == PersonRole.PRIMARY)
        .every((w2) => w2.ssWithholding <= fica.maxSSTax)
    ) {
      claimableExcessFica += primaryFica - fica.maxSSTax
    }

    if (
      spouseFica > fica.maxSSTax &&
      w2s
        .filter((w2) => w2.personRole == PersonRole.SPOUSE)
        .every((w2) => w2.ssWithholding <= fica.maxSSTax)
    ) {
      claimableExcessFica += spouseFica - fica.maxSSTax
    }

    return claimableExcessFica
  }

  isNeeded = (): boolean => this.claimableExcessSSTaxWithholding() > 0

  deductions = (): number => 0
  // Part I: Nonrefundable credits
  l1 = (): number | undefined => undefined // TODO: Foreign tax credit. Attach Form 1116 if required
  l2 = (): number | undefined => undefined // TODO: Credit for child and dependent care expenses from Form 2441, line 11. Attach Form 2441
  l3 = (): number | undefined => this.f1040.f8863?.l19() // Education credits from Form 8863, line 19
  l4 = (): number | undefined => undefined // TODO: Retirement savings contributions credit. Attach Form 8880
  l5 = (): number | undefined => this.f1040.f5695?.l15() // Residential energy credits. Attach Form 5695
  l6a = (): number | undefined => undefined // TODO: General business credit. Attach Form 3800
  l6b = (): number | undefined => undefined // TODO: Credit for prior year minimum tax. Attach Form 8801
  l6c = (): number | undefined => undefined // TODO: Adoption credit. Attach Form 8839
  l6d = (): number | undefined => undefined // TODO: Credit for the elderly or disabled. Attach Schedule R
  l6e = (): number | undefined => undefined // TODO: Alternative motor vehicle credit. Attach Form 8910
  l6f = (): number | undefined => undefined // TODO: Qualified plug-in motor vehicle credit. Attach Form 8936
  l6g = (): number | undefined => undefined // TODO: Mortgage interest credit. Attach Form 8396
  l6h = (): number | undefined => undefined // TODO: District of Columbia first-time homebuyer credit. Attach Form 8859
  l6i = (): number | undefined => undefined // TODO: Qualified electric vehicle credit. Attach Form 8834
  l6j = (): number | undefined => undefined // TODO: Alternative fuel vehicle refueling property credit. Attach Form 8911
  l6k = (): number | undefined => undefined // TODO: Credit to holders of tax credit bonds. Attach Form 8912
  l6l = (): number | undefined => undefined // TODO: Amount on Form 8978, line 14. See instructions
  l6zDesc1 = (): string | undefined => undefined
  l6zDesc2 = (): string | undefined => undefined
  l6z = (): number | undefined => undefined // TODO: Other nonrefundable credits. List type and amount:

  l7 = (): number =>
    sumFields([
      this.l6a(),
      this.l6b(),
      this.l6c(),
      this.l6d(),
      this.l6e(),
      this.l6f(),
      this.l6g(),
      this.l6h(),
      this.l6i(),
      this.l6j(),
      this.l6k(),
      this.l6l(),
      this.l6z()
    ])

  l8 = (): number =>
    sumFields([
      this.l1(),
      this.l2(),
      this.l3(),
      this.l4(),
      this.l5(),
      this.l7()
    ])

  // Part II: Other payments and refundable credits
  l9 = (): number | undefined => this.f1040.f8962?.credit() // Net premium tax credit. Attach Form 8962

  // TODO: Amount paid with extension for time to file
  l10 = (): number | undefined => undefined

  l11 = (): number =>
    // TODO: also applies to RRTA tax
    this.claimableExcessSSTaxWithholding()

  l12 = (): number | undefined => this.f1040.f4136?.credit()

  l13a = (): number | undefined => this.f1040.f2439?.credit()
  // TODO: qualified sick and family leave credits
  // Schedule H and form 7202 pre 4/1/21
  l13b = (): number | undefined => undefined

  // Health coverage tax credit from 8885
  l13c = (): number | undefined => undefined

  // TODO: Credit for repayment of amounts included in income from earlier years
  l13d = (): number | undefined => undefined // TODO: 'other' box

  // reserved!
  l13e = (): number | undefined => undefined

  // deferred amount of net 965 tax liability
  l13f = (): number | undefined => undefined

  l13g = (): number | undefined => this.f1040.f2441?.credit()

  // TODO: qualified sick and family leave credits
  // Schedule H and form 7202 post 3/31/21
  l13h = (): number | undefined => undefined

  l13zDesc1 = (): string | undefined => undefined
  l13zDesc2 = (): string | undefined => undefined
  l13z = (): number | undefined => undefined

  l14 = (): number =>
    sumFields([
      this.l13a(),
      this.l13b(),
      this.l13c(),
      this.l13d(),
      this.l13e(),
      this.l13f(),
      this.l13g(),
      this.l13h(),
      this.l13z()
    ])

  l15 = (): number =>
    sumFields([this.l9(), this.l10(), this.l11(), this.l12(), this.l14()])

  // Credit for child and dependent care expenses form 2441, line 10

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
    this.l6c(),
    this.l6d(),
    this.l6e(),
    this.l6f(),
    this.l6g(),
    this.l6h(),
    this.l6i(),
    this.l6j(),
    this.l6k(),
    this.l6l(),
    this.l6zDesc1(),
    this.l6zDesc2(),
    this.l6z(),
    this.l7(),
    this.l8(),

    this.l9(),
    this.l10(),
    this.l11(),
    this.l12(),

    this.l13a(),
    this.l13b(),
    this.l13c(),
    this.l13d(),
    //this.l13e(),  // this field is left for future use and is not fillable
    this.l13f(),
    this.l13g(),
    this.l13h(),
    this.l13zDesc1(),
    this.l13zDesc2(),
    this.l13z(),
    this.l14(),
    this.l15()
  ]
}
