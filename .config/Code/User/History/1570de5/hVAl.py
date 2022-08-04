class Point:
    b = 0x066647ede6c332c7f8c0923bb58213b333b20e9ce4281fe115f7d8f90ad
    def __init__(self, x=float('inf'), y=float('inf')):
        self.x = x
        self.y = y

    def copy(self):
        return Point(self.x, self.y)

    def is_zero(self):
        return self.x > 1e20 or self.x < -1e20

    def neg(self):
        return Point(self.x, -self.y)

    def dbl(self):
        if self.is_zero():
            return self.copy()
        try:
            L = (self.x) + (self.y / self.x)
        except ZeroDivisionError:
            return Point()
        x = (L * L) + L + 1
        return Point(x, (self.x * self.x + L * x + x))

    def add(self, q):
        if self.x == q.x and self.y == q.y:
            return self.dbl()
        if self.is_zero():
            return q.copy()
        if q.is_zero():
            return self.copy()
        try:
            L = ((self.y + q.y) / (self.x + q.x))
            # L = (q.y - self.y) / (q.x - self.x)
        except ZeroDivisionError:
            return Point()
        x = L * L + L + self.x + q.x + 1
        return Point(L * (self.x + x) + x + self.y)

    def mul(self, n):
        p = self.copy()
        r = Point()
        i = 1
        while i <= n:
            if i&n:
                r = r.add(p)
            p = p.dbl()
            i <<= 1
        return r

    def __str__(self):
        return "({:.3f}, {:.3f})".format(self.x, self.y)

def PubKeyGen(privkey):
    G = Point(0x0fac9dfcbac8313bb2139f1bb755fef65bc391f8b36f8f8eb7371fd558b, 0x1006a08a41903350678e58528bebf8a0beff867a7ca36716f7e01f81052)
    print(G.mul(privkey).__str__)