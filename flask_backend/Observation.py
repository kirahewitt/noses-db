_FL = 0
_YEAR = 1
_DATE = 2
_LOC = 3
_SEX = 4
_AGE = 5
_PUP = 6

_NEWMARK1 = 7
_MARK1 = 8
_MARKPOS1 = 9

_NEWMARK2 = 10
_MARK2 = 11
_MARKPOS2 = 12

_NEWTAG1 = 13
_TAG1 = 14
_TAGPOS1 = 15

_NEWTAG2 = 16
_TAG2 = 17
_TAGPOS2 = 18

_MOLT = 19
_SEASON = 20
_STLENGTH = 21
_CRVLENGTH = 22
_AXGIRTH = 23
_MASS = 24
_TARE = 25
_MASSTARE = 26
_LASTSEEN = 27
_FIRSTSEEN = 28
_RANGE = 29
_COMMENTS = 30
_ENTERANO = 31

class Observation:
    def __init__(self, csvRow):
        self.fieldLeaderInitials = csvRow[_FL]
        self.seasonYear = csvRow[_YEAR]
        self.dateRecorded = csvRow[_DATE]
        self.locationCode = csvRow[_LOC]
        self.sealSex = csvRow[_SEX]
        self.sealAgeClass = csvRow[_AGE]
        self.sealHasPup = csvRow[_PUP]

        self.isNewMark1 = csvRow[_NEWMARK1]
        self.markValue1 = csvRow[_MARK1]
        self.markPosition1 = csvRow[_MARKPOS1]

        self.isNewMark2 = csvRow[_NEWMARK2]
        self.markValue2 = csvRow[_MARK2]
        self.markPosition2 = csvRow[_MARKPOS2]

        self.isNewTag1 = csvRow[_NEWTAG1]
        self.tagValue1 = csvRow[_TAG1]
        self.tagPosition1 = csvRow[_TAGPOS1]

        self.isNewTag2 = csvRow[_NEWTAG2]
        self.tagValue2 = csvRow[_TAG2]
        self.tagPosition2 = csvRow[_TAGPOS2]

        self.moltPercentage = csvRow[_MOLT]

        # this seems to be the same as seasonYear
        self.seasonYear2 = csvRow[_SEASON]

        self.standardLength = csvRow[_STLENGTH]
        self.curvilinearLength = csvRow[_CRVLENGTH]
        self.auxiliaryGirth = csvRow[_AXGIRTH]
        self.mass = csvRow[_MASS]
        self.tare = csvRow[_TARE]
        self.massTare = csvRow[_MASSTARE]
        self.lastSeenAsPup = csvRow[_LASTSEEN]
        self.firstSeenAsWeaner = csvRow[_FIRSTSEEN]
        

        self.range = csvRow[_RANGE]
        self.comments = csvRow[_COMMENTS]
        self.enteredInAno = csvRow[_ENTERANO]